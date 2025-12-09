CREATE TABLE "planets" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

CREATE TABLE "impact_types" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "delivery_point" (
    "id" BIGSERIAL PRIMARY KEY,
    "delivery_type" VARCHAR(255) NOT NULL
);

CREATE TABLE "biomes" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "planet_id" INTEGER NOT NULL REFERENCES "planets"("id"),
    "delivery_point_id" BIGINT REFERENCES "delivery_point"("id")
);

CREATE TABLE "warehouses" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "delivery_point_id" BIGINT REFERENCES "delivery_point"("id")
);

CREATE TABLE "stations" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "planet_id" INTEGER NOT NULL REFERENCES "planets"("id"),
    "type" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "delivery_point_id" BIGINT REFERENCES "delivery_point"("id")
);

CREATE TABLE "employees" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "post" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "experience" INTEGER NOT NULL DEFAULT 0 CHECK ("experience" >= 0),
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "hired_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "fired_date" DATE
);

CREATE TABLE "cargos" (
    "id" BIGSERIAL PRIMARY KEY,
    "weight" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "ship_to_date" DATE NOT NULL,
    "ship_to_point" BIGINT NOT NULL REFERENCES "delivery_point"("id")
);

CREATE TABLE "teams" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "cargo_id" BIGINT REFERENCES "cargos"("id"),
    "located_at" BIGINT references "delivery_point"("id"),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Created'
);

CREATE TABLE "team_members" ( 
    "id" SERIAL PRIMARY KEY,
    "team_id" BIGINT NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
    "employee_id" BIGINT NOT NULL REFERENCES "employees"("id")
);

--триггер — максимум 4 сотрудника в команде
CREATE OR REPLACE FUNCTION trg_team_member_limit()
RETURNS TRIGGER AS $$
DECLARE cnt INT;
BEGIN
    SELECT COUNT(*) INTO cnt FROM team_members WHERE team_id = NEW.team_id;
    IF cnt >= 4 THEN
        RAISE EXCEPTION 'Команда % уже имеет 4 участников', NEW.team_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_team_member_limit
BEFORE INSERT ON team_members
FOR EACH ROW EXECUTE FUNCTION trg_team_member_limit();

CREATE TABLE "weapon_info" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT,
    "weight" DECIMAL(10,3) NOT NULL CHECK ("weight" > 0),
    "impact_type" BIGINT references "impact_types"("id")
);

CREATE TABLE "equipment_info" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT,
    "weight" DECIMAL(10,3) NOT NULL CHECK ("weight" > 0)
);

CREATE TABLE "weapons" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL REFERENCES "weapon_info"("name"),
    "identification_number" VARCHAR(100) NOT NULL UNIQUE,
    "located_at" BIGINT REFERENCES "delivery_point"("id"),
    "cargo_id" BIGINT REFERENCES "cargos"("id"),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Stored',
    "date" TIMESTAMP NOT NULL
);

CREATE TABLE "equipment" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL REFERENCES "equipment_info"("name"),
    "identification_number" VARCHAR(100) NOT NULL UNIQUE,
    "located_at" BIGINT REFERENCES "delivery_point"("id"),
    "cargo_id" BIGINT REFERENCES "cargos"("id"),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Stored',
    "date" TIMESTAMP NOT NULL
);

-- Информация о типах ресурсов
CREATE TABLE "resource_info" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT,
    "weight_per_unit" DECIMAL(10,3) NOT NULL CHECK ("weight_per_unit" > 0)
);

-- Конкретные ресурсы в грузах (с количеством)
CREATE TABLE "resources" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL REFERENCES "resource_info"("name"),
    "located_at" BIGINT REFERENCES "delivery_point"("id"),
    "cargo_id" BIGINT REFERENCES "cargos"("id"),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Stored',
    "date" TIMESTAMP NOT NULL,
    "quantity" INTEGER NOT NULL CHECK ("quantity" > 0)
);

CREATE TABLE "missions" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255),
    "biome_id" INTEGER NOT NULL REFERENCES "biomes"("id"),
    "description" TEXT,
    "team_id" INTEGER NOT NULL REFERENCES "teams"("id"),
    "required_experience" INTEGER NOT NULL DEFAULT 0 CHECK ("required_experience" >= 0),
    "status" VARCHAR(255) NOT NULL,
    "mission_start" TIMESTAMP(0) NOT NULL,
    "mission_end" TIMESTAMP(0) NOT NULL
);

-- триггер: проверка, что опыт всех участников >= необходимого
CREATE OR REPLACE FUNCTION trg_check_team_experience()
RETURNS TRIGGER AS $$
DECLARE insufficient_count INT;
BEGIN
    SELECT COUNT(*) INTO insufficient_count
    FROM team_members tm
    JOIN employees e ON e.id = tm.employee_id
    WHERE tm.team_id = NEW.team_id
      AND e.experience < NEW.required_experience;

    IF insufficient_count > 0 THEN
        RAISE EXCEPTION 'Некоторые члены команды не имеют достаточного опыта для миссии %', NEW.name;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_team_experience
BEFORE INSERT OR UPDATE ON missions
FOR EACH ROW EXECUTE FUNCTION trg_check_team_experience();

CREATE TABLE "requests" (
    "id" BIGSERIAL PRIMARY KEY,
	"status" VARCHAR(255) NOT NULL DEFAULT 'Created',
    "sender_department" VARCHAR(255) NOT NULL,
    "recipient_department" VARCHAR(255) NOT NULL,
    "request_code" VARCHAR(100) NOT NULL,
    "description" TEXT,
	"response" TEXT,
    "sender_employee_id" BIGINT REFERENCES "employees"("id"),
	"recipient_employee_id" BIGINT REFERENCES "employees"("id")
);

CREATE TABLE "system_settings" (
    "param_name" VARCHAR(100) PRIMARY KEY,
    "param_value" TEXT NOT NULL
);

INSERT INTO "system_settings" ("param_name", "param_value")
VALUES ('ONE_DWARF_WEIGHT', '50');

CREATE TABLE "space_ship" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "lifting_capacity" DECIMAL(10,3) NOT NULL CHECK ("lifting_capacity" > 0)
);

CREATE TABLE "logistics" (
    "id" BIGSERIAL PRIMARY KEY,
    "start_time" TIMESTAMP(0) NOT NULL,
    "cargo_id" BIGINT NOT NULL REFERENCES "cargos"("id"),
    "space_ship_id" INTEGER REFERENCES "space_ship"("id"),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Created'
);

CREATE TABLE "monsters" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "danger_level" INTEGER NOT NULL,
    "heritage" VARCHAR(100) NOT NULL,
    "monster_type" VARCHAR(100) NOT NULL,
    "biome_id" INTEGER NOT NULL REFERENCES "biomes"("id"),
    "armor_type" VARCHAR(100) NOT NULL
);

CREATE TABLE "monster_weaknesses" (
    "monster_id" BIGINT NOT NULL REFERENCES "monsters"("id") ON DELETE CASCADE,
    "impact_type_id" INTEGER NOT NULL REFERENCES "impact_types"("id") ON DELETE CASCADE,
    PRIMARY KEY ("monster_id", "impact_type_id")
);

CREATE TABLE "monster_strengths" (
    "monster_id" BIGINT NOT NULL REFERENCES "monsters"("id") ON DELETE CASCADE,
    "impact_type_id" INTEGER NOT NULL REFERENCES "impact_types"("id") ON DELETE CASCADE,
    PRIMARY KEY ("monster_id", "impact_type_id")
);

ALTER TABLE weapons ADD CONSTRAINT chk_weapon_status CHECK (status IN ('Stored', 'Shipping'));
ALTER TABLE resources ADD CONSTRAINT chk_resources_status CHECK (status IN ('Stored', 'Shipping'));
ALTER TABLE equipment ADD CONSTRAINT chk_equipment_status CHECK (status IN ('Stored', 'Shipping'));
ALTER TABLE logistics ADD CONSTRAINT chk_logistics_status CHECK (status IN ('Created', 'Shipping', 'Done'));