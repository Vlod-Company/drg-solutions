CREATE OR REPLACE FUNCTION recalculate_cargo_weight(changed_cargo_id BIGINT)
    RETURNS VOID AS $$
DECLARE
    new_weight DECIMAL(10, 3) := 0;
    dwarf_weight DECIMAL(10, 3);
    team_dwarf_count INT;
BEGIN
    IF changed_cargo_id IS NULL THEN
        RETURN;
    END IF;

    -- Получаем вес одного дварфа
    SELECT COALESCE(param_value::DECIMAL, 50)
    INTO dwarf_weight
    FROM system_settings
    WHERE param_name = 'ONE_DWARF_WEIGHT';

    -- 1. Вес команды (активные сотрудники)
    SELECT COUNT(e.id)
    INTO team_dwarf_count
    FROM teams t
             JOIN team_members tm ON tm.team_id = t.id
             JOIN employees e ON e.id = tm.employee_id
    WHERE t.cargo_id = changed_cargo_id
      AND e.status = 'active'
      AND e.fired_date IS NULL;

    new_weight := new_weight + COALESCE(team_dwarf_count, 0) * dwarf_weight;

    -- 2. Вес ресурсов: вес_за_единицу * количество
    new_weight := new_weight + COALESCE((
                                            SELECT SUM(ri.weight_per_unit * r.quantity)
                                            FROM resources r
                                                     JOIN resource_info ri ON r.name = ri.name
                                            WHERE r.cargo_id = changed_cargo_id
                                        ), 0);

    -- 3. Вес оборудования
    new_weight := new_weight + COALESCE((
                                            SELECT SUM(ei.weight)
                                            FROM equipment e
                                                     JOIN equipment_info ei ON e.name = ei.name
                                            WHERE e.cargo_id = changed_cargo_id
                                        ), 0);

    -- 4. Вес оружия
    new_weight := new_weight + COALESCE((
                                            SELECT SUM(wi.weight)
                                            FROM weapons w
                                                     JOIN weapon_info wi ON w.name = wi.name
                                            WHERE w.cargo_id = changed_cargo_id
                                        ), 0);

    -- Обновляем вес груза
    UPDATE cargos
    SET weight = new_weight
    WHERE id = changed_cargo_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_recommended_weapons(mission_id INT)
    RETURNS TABLE (
                      weapon_id BIGINT,
                      weapon_name VARCHAR(255),
                      impact_type_name VARCHAR(100)
                  ) AS $$
BEGIN
    RETURN QUERY
        WITH biome_monsters AS (
            -- Все монстры в биоме миссии
            SELECT DISTINCT m.id AS monster_id
            FROM missions mis
                     JOIN biomes b ON mis.biome_id = b.id
                     JOIN monsters m ON m.biome_id = b.id
            WHERE mis.id = mission_id
        ),
             required_impact_types AS (
                 -- Все типы урона, которые являются СЛАБОСТЯМИ этих монстров
                 SELECT DISTINCT mw.impact_type_id
                 FROM biome_monsters bm
                          JOIN monster_weaknesses mw ON mw.monster_id = bm.monster_id
             )
        -- Оружие, которое наносит один из требуемых типов урона
        SELECT
            w.id AS weapon_id,
            w.name AS weapon_name,
            it.name AS impact_type_name
        FROM weapons w
                 JOIN weapon_info wi ON w.name = wi.name
                 JOIN impact_types it ON wi.impact_type = it.id
        WHERE wi.impact_type IN (SELECT impact_type_id FROM required_impact_types);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION how_much_at_time(delivery_id BIGINT, at_time TIMESTAMP)
    RETURNS TABLE (
                      item_type TEXT,
                      info_name TEXT,
                      total_count BIGINT
                  ) AS $$
BEGIN
    RETURN QUERY
        WITH all_items AS (
            -- EQUIPMENT
            SELECT
                'equipment'::TEXT AS item_type,
                ei.name::TEXT AS info_name,
                (COALESCE(COUNT(s.id), 0) - COALESCE(COUNT(sh.id), 0))::BIGINT AS total_count
            FROM equipment_info ei
                     LEFT JOIN equipment s ON s.name = ei.name
                AND s.status = 'Stored'
                AND s.located_at = delivery_id
                AND s.date <= at_time
                     LEFT JOIN equipment sh ON sh.name = ei.name
                AND sh.status = 'Shipping'
                AND sh.located_at = delivery_id
                AND sh.date <= at_time
            GROUP BY ei.name

            UNION ALL

            -- WEAPONS
            SELECT
                'weapon'::TEXT AS item_type,
                wi.name::TEXT AS info_name,
                (COALESCE(COUNT(s.id), 0) - COALESCE(COUNT(sh.id), 0))::BIGINT AS total_count
            FROM weapon_info wi
                     LEFT JOIN weapons s ON s.name = wi.name
                AND s.status = 'Stored'
                AND s.located_at = delivery_id
                AND s.date <= at_time
                     LEFT JOIN weapons sh ON sh.name = wi.name
                AND sh.status = 'Shipping'
                AND sh.located_at = delivery_id
                AND sh.date <= at_time
            GROUP BY wi.name

            UNION ALL

            -- RESOURCES
            SELECT
                'resource'::TEXT AS item_type,
                r.name::TEXT AS info_name,
                COALESCE(SUM(r.quantity), 0)::BIGINT AS total_count
            FROM resources r
            WHERE r.status = 'Stored'
              AND r.located_at = delivery_id
              AND r.date = (
                SELECT MAX(r2.date)
                FROM resources r2
                WHERE r2.name = r.name
                  AND r2.located_at = delivery_id
                  AND r2.date <= at_time
            )
            GROUP BY r.name
        )
        -- Явно используем алиас ai, чтобы избежать неоднозначности имен
        SELECT ai.item_type, ai.info_name, ai.total_count
        FROM all_items ai
        WHERE ai.total_count > 0;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_check_cargo_located_at_consistency()
    RETURNS TRIGGER AS $$
DECLARE
    v_cargo_id BIGINT;
    v_expected_located_at BIGINT;
    v_actual_located_at BIGINT;
BEGIN
    -- Определяем значения в зависимости от таблицы
    IF TG_TABLE_NAME = 'weapons' THEN
        v_cargo_id := NEW.cargo_id;
        v_actual_located_at := NEW.located_at;
    ELSIF TG_TABLE_NAME = 'equipment' THEN
        v_cargo_id := NEW.cargo_id;
        v_actual_located_at := NEW.located_at;
    ELSIF TG_TABLE_NAME = 'resources' THEN
        v_cargo_id := NEW.cargo_id;
        v_actual_located_at := NEW.located_at;
    ELSE
        RETURN NEW;
    END IF;

    IF v_cargo_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Получаем ожидаемый located_at для этого cargo_id
    SELECT COALESCE(
                   (SELECT located_at FROM weapons WHERE cargo_id = v_cargo_id AND located_at IS NOT NULL LIMIT 1),
                   (SELECT located_at FROM equipment WHERE cargo_id = v_cargo_id AND located_at IS NOT NULL LIMIT 1),
                   (SELECT located_at FROM resources WHERE cargo_id = v_cargo_id AND located_at IS NOT NULL LIMIT 1)
           ) INTO v_expected_located_at;

    IF v_expected_located_at IS NULL THEN
        RETURN NEW;
    END IF;

    IF v_actual_located_at IS NOT NULL AND v_actual_located_at != v_expected_located_at THEN
        RAISE EXCEPTION 'Несоответствие located_at для cargo_id %. Ожидалось %, получено %',
            v_cargo_id, v_expected_located_at, v_actual_located_at;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Для weapons
CREATE TRIGGER trg_check_cargo_located_at_weapons
    BEFORE INSERT OR UPDATE OF cargo_id, located_at ON weapons
    FOR EACH ROW EXECUTE FUNCTION trg_check_cargo_located_at_consistency();

-- Для equipment
CREATE TRIGGER trg_check_cargo_located_at_equipment
    BEFORE INSERT OR UPDATE OF cargo_id, located_at ON equipment
    FOR EACH ROW EXECUTE FUNCTION trg_check_cargo_located_at_consistency();

-- Для resources
CREATE TRIGGER trg_check_cargo_located_at_resources
    BEFORE INSERT OR UPDATE OF cargo_id, located_at ON resources
    FOR EACH ROW EXECUTE FUNCTION trg_check_cargo_located_at_consistency();

-- ==============================
-- INDEXES RECREATION SCRIPT
-- Compatible with all PostgreSQL versions
-- ==============================

-- === BIOMES ===
DROP INDEX IF EXISTS idx_biomes_planet_id;
CREATE INDEX idx_biomes_planet_id ON biomes (planet_id); -- equality index

DROP INDEX IF EXISTS idx_biomes_delivery_point_id;
CREATE INDEX idx_biomes_delivery_point_id ON biomes (delivery_point_id); -- equality index

-- === WAREHOUSES ===
DROP INDEX IF EXISTS idx_warehouses_delivery_point_id;
CREATE INDEX idx_warehouses_delivery_point_id ON warehouses (delivery_point_id); -- equality index

-- === STATIONS ===
DROP INDEX IF EXISTS idx_stations_planet_id;
CREATE INDEX idx_stations_planet_id ON stations (planet_id); -- equality index

DROP INDEX IF EXISTS idx_stations_delivery_point_id;
CREATE INDEX idx_stations_delivery_point_id ON stations (delivery_point_id); -- equality index

-- === CARGOS ===
DROP INDEX IF EXISTS idx_cargos_ship_to_point;
CREATE INDEX idx_cargos_ship_to_point ON cargos (ship_to_point); -- equality index

-- === TEAMS ===
DROP INDEX IF EXISTS idx_teams_cargo_id;
CREATE INDEX idx_teams_cargo_id ON teams (cargo_id); -- equality index

-- === MISSIONS ===
DROP INDEX IF EXISTS idx_missions_biome_id;
CREATE INDEX idx_missions_biome_id ON missions (biome_id); -- equality index

DROP INDEX IF EXISTS idx_missions_team_id;
CREATE INDEX idx_missions_team_id ON missions (team_id); -- equality index

-- === EQUIPMENT ===
DROP INDEX IF EXISTS idx_equipment_located_at;
CREATE INDEX idx_equipment_located_at ON equipment (located_at); -- equality index

DROP INDEX IF EXISTS idx_equipment_cargo_id;
CREATE INDEX idx_equipment_cargo_id ON equipment (cargo_id); -- equality index

DROP INDEX IF EXISTS idx_equipment_status_date;
CREATE INDEX idx_equipment_status_date ON equipment (status, date); -- range support

-- === WEAPONS ===
DROP INDEX IF EXISTS idx_weapons_located_at;
CREATE INDEX idx_weapons_located_at ON weapons (located_at); -- equality index

DROP INDEX IF EXISTS idx_weapons_cargo_id;
CREATE INDEX idx_weapons_cargo_id ON weapons (cargo_id); -- equality index

DROP INDEX IF EXISTS idx_weapons_status_date;
CREATE INDEX idx_weapons_status_date ON weapons (status, date); -- range support

-- === RESOURCES ===
DROP INDEX IF EXISTS idx_resources_located_at;
CREATE INDEX idx_resources_located_at ON resources (located_at); -- equality index

DROP INDEX IF EXISTS idx_resources_status_date;
CREATE INDEX idx_resources_status_date ON resources (status, date); -- range support

-- === LOGISTICS ===
DROP INDEX IF EXISTS idx_logistics_cargo_id;
CREATE INDEX idx_logistics_cargo_id ON logistics (cargo_id); -- equality index

DROP INDEX IF EXISTS idx_logistics_space_ship_id;
CREATE INDEX idx_logistics_space_ship_id ON logistics (space_ship_id); -- equality index

-- === EMPLOYEES ===
DROP INDEX IF EXISTS idx_employees_status;
CREATE INDEX idx_employees_status ON employees (status); -- equality index

DROP INDEX IF EXISTS idx_employees_fired_date;
CREATE INDEX idx_employees_fired_date ON employees (fired_date); -- range support

-- === REQUESTS ===
DROP INDEX IF EXISTS idx_requests_code;
CREATE UNIQUE INDEX idx_requests_code ON requests (request_code); -- equality index

-- === SYSTEM SETTINGS ===
DROP INDEX IF EXISTS idx_system_settings_param_name;
CREATE UNIQUE INDEX idx_system_settings_param_name ON system_settings (param_name); -- equality index