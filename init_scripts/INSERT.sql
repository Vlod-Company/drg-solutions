-- Планеты
INSERT INTO planets (name) VALUES
                               ('Hoxxes IV'),
                               ('Astraeus'),
                               ('Feydor');

-- Типы воздействия
INSERT INTO impact_types (name) VALUES
                                    ('Fire'),
                                    ('Exploиsive'),
                                    ('Kinetic'),
                                    ('Electric'),
                                    ('Acid');

-- Точки доставки
INSERT INTO delivery_point (delivery_type) VALUES
                                               ('WAREHOUSE'),            -- 1
                                               ('BIOME'),       -- 2
                                               ('STATION'),            -- 3
                                               ('STATION'),         -- 4
                                               ('BIOME');             -- 5

-- Биомы
INSERT INTO biomes (name, description, planet_id, delivery_point_id) VALUES
                                                                         ('Salt Pits', 'Deep salt caverns with crystalline structures.', 1, 2),
                                                                         ('Crystalline Caves', 'Glowing crystals and dangerous fauna.', 1, 2),
                                                                         ('Sandblasted Corridors', 'Wind-swept tunnels with abrasive sand.', 2, 2),
                                                                         ('Radioactive Exclusion Zone', 'High radiation, mutated creatures.', 3, 2);

-- Склады
INSERT INTO warehouses (name, delivery_point_id) VALUES
                                                     ('Central Depot', 1),
                                                     ('Forward Storage Alpha', 4);

-- Станции
INSERT INTO stations (name, planet_id, type, status, delivery_point_id) VALUES
                                                                            ('Deep Core Relay', 1, 'COMMUNICATION', 'ACTIVE', 3),
                                                                            ('Orbital Drop Hub', 2, 'MINING', 'ACTIVE', 3),
                                                                            ('Emergency Evac Station', 3, 'MILITARY', 'UNDER_CONSTRUCTION', 3);

-- Сотрудники с хешированными паролями
INSERT INTO employees (name, post, department, experience, status, hired_date) VALUES
                                                                                   ('Rourke', 'Driller', 'Rnd',   120, 'ACTIVE', '2023-01-15'),
                                                                                   ('Maggie', 'Scout',  'Management',   95,  'ACTIVE', '2023-03-22'),
                                                                                   ('Berg', 'Gunner',  'Mission control',  110, 'ACTIVE', '2022-11-10'),
                                                                                   ('Daisy', 'Engineer',  'Logistics', 105, 'ACTIVE', '2023-02-01'),
                                                                                   ('Lars', 'Scout',   'Dwarf team',  40,  'ACTIVE', '2024-01-10'),
                                                                                   ('Gunnar', 'Driller',   'Mission control',30,  'ACTIVE', '2024-02-15'),
                                                                                   ('Sven', 'Engineer',  'Mission control',25,  'ACTIVE', '2024-03-01'),
                                                                                   ('Thor', 'Gunner',    'Mission control',50,  'ACTIVE', '2023-12-05');

-- Грузы
INSERT INTO cargos (weight, ship_to_date, ship_to_point) VALUES
                                                             (1200.500, '2025-10-20', 2),
                                                             (800.250,  '2025-10-22', 4),
                                                             (2500.000, '2025-10-25', 5),
                                                             (600.750,  '2025-10-28', 2);

-- Команды
INSERT INTO teams (name, cargo_id, located_at, status) VALUES
                                                           ('Team Rock & Stone', 1, 1, 'Active'),
                                                           ('Team Deep Core',    2, 1, 'Created'),
                                                           ('Team Backup Crew',  4, 1, 'Created');

-- Члены команд (макс. 4 на команду)
INSERT INTO team_members (team_id, employee_id) VALUES
-- Team Rock & Stone
(1, 1), -- Rourke
(1, 2), -- Maggie
(1, 3), -- Berg
(1, 4), -- Daisy
-- Team Deep Core
(2, 5), -- Lars
(2, 6), -- Gunnar
(2, 7), -- Sven
(2, 8); -- Thor

-- Создание ролей
INSERT INTO roles (name) VALUES
                             ('Admin'),
                             ('Manager'),
                             ('Driller'),
                             ('Engineer'),
                             ('Gunner'),
                             ('Scout');

-- Создание пользователей с хешированными паролями (примеры bcrypt хешей)
INSERT INTO users (employee_id, username, password_hash, salt, created_at, is_active) VALUES
-- Rourke (Admin)

(2, 'maggie', '$2b$12$examplehashformaggiemanager1234567890abcde', 'maggie_salt_002', '2023-03-22 10:00:00', TRUE),

(3, 'berg', '$2b$12$examplehashforberggunner1234567890abcdefg', 'berg_salt_003', '2022-11-10 08:30:00', TRUE),

(4, 'daisy', '$2b$12$examplehashfordaisyengineer1234567890abc', 'daisy_salt_004', '2023-02-01 11:00:00', TRUE),

(5, 'lars', '$2b$12$examplehashforlars_scout1234567890abcdef', 'lars_salt_005', '2024-01-10 09:30:00', TRUE),

(6, 'gunnar', '$2b$12$examplehashforgunnardriller1234567890a', 'gunnar_salt_006', '2024-02-15 10:15:00', TRUE),

(7, 'sven', '$2b$12$examplehashforsvenengineer1234567890abc', 'sven_salt_007', '2024-03-01 08:45:00', TRUE),

(8, 'thor', '$2b$12$examplehashforthorgunner1234567890abcdef', 'thor_salt_008', '2023-12-05 09:20:00', TRUE);

-- Назначение ролей пользователям
INSERT INTO user_roles (user_id, role_id) VALUES
                                              (1, 1), -- Manager
                                              (2, 2), -- Gunner
                                              (3, 2), -- Engineer
                                              (4, 2), -- Scout
                                              (5, 2), -- Driller
                                              (6, 2), -- Engineer
                                              (7, 2); -- Gunner

INSERT INTO weapon_info (name, description, weight, impact_type) VALUES
                                                                     ('Drillsword',   'Melee weapon for Driller',          8.500, 3), -- Kinetic
                                                                     ('Boomstick',    'Double-barrel shotgun',             6.200, 2), -- Explosive
                                                                     ('Zhukov',       'Assault rifle',                     4.800, 3), -- Kinetic
                                                                     ('PGL',          'Grenade launcher',                  9.100, 2), -- Explosive
                                                                     ('Flamethrower', 'Area denial incendiary weapon',    7.300, 1); -- Fire

-- Информация о снаряжении
INSERT INTO equipment_info (name, description, weight) VALUES
                                                           ('Flame Turret',     'Deployable fire turret',         12.000),
                                                           ('Zipline',          'Rapid traversal tool',           3.500),
                                                           ('Platform Gun',     'Creates walkable platforms',     5.000),
                                                           ('Sentry Gun',       'Auto-targeting turret',          10.000),
                                                           ('Bubble Shield',    'Personal protective barrier',    6.000);

-- Оружие
INSERT INTO weapons (name, identification_number, located_at, cargo_id, status, date) VALUES
                                                                                          ('Drillsword',   'DS-001', 1, 1, 'Stored',    '2025-10-15 10:00:00'),
                                                                                          ('Drillsword',   'DS-002', 1, 1, 'Stored',    '2025-10-15 10:00:00'),
                                                                                          ('Boomstick',    'BS-002', 1, 1, 'Stored',    '2025-10-15 10:05:00'),
                                                                                          ('Zhukov',       'ZR-003', 1, 1, 'Stored',    '2025-10-15 10:10:00'),
                                                                                          ('PGL',          'PGL-004',4, 2, 'Stored',    '2025-10-16 09:00:00'),
                                                                                          ('Flamethrower', 'FT-005', 4, 2, 'Stored',    '2025-10-16 09:15:00');

-- Снаряжение
INSERT INTO equipment (name, identification_number, located_at, cargo_id, status, date) VALUES
                                                                                            ('Flame Turret',  'FT-001', 1, 1, 'Stored',    '2025-10-15 11:00:00'),
                                                                                            ('Zipline',       'ZP-002', 1, 1, 'Stored',    '2025-10-15 11:05:00'),
                                                                                            ('Platform Gun',  'PG-003', 4, 2, 'Stored',    '2025-10-16 09:30:00'),
                                                                                            ('Sentry Gun',    'SG-004', 4, 2, 'Stored',    '2025-10-16 09:35:00'),
                                                                                            ('Bubble Shield', 'BS-005', 4, 2, 'Stored',    '2025-10-16 09:40:00');

-- Сначала создаём тип ресурса
INSERT INTO resource_info (name, description, weight_per_unit)
VALUES ('Gold', 'Precious metal', 0.500);

-- Затем — экземпляр в грузе
INSERT INTO resources (name, cargo_id, status, date, quantity)
VALUES ('Gold', 1, 'Stored', '2025-10-29 12:00:00', 100);
-- Общий вес: 0.500 * 100 = 50.000

-- Монстры
INSERT INTO monsters (name, description, danger_level, heritage, monster_type, biome_id, armor_type) VALUES
                                                                                                         ('Glyphid Dreadnought', 'Heavily armored insectoid brute', 5, 'Glyphid', 'Brute', 1, 'Chitin'),
                                                                                                         ('Mactera Spitball',    'Flying acid-spitting pest',     2, 'Mactera', 'Swarm', 2, 'Soft'),
                                                                                                         ('Grumble',             'Burrowing explosive creature',  3, 'Glyphid', 'Ambusher', 3, 'Chitin'),
                                                                                                         ('Dreadnaught Hulk',    'Radioactive mutated giant',     6, 'Mutant',  'Titan', 4, 'Reinforced');

-- Слабости монстров
INSERT INTO monster_weaknesses (monster_id, impact_type_id) VALUES
                                                                (1, 1), -- Dreadnought слаб к огню
                                                                (2, 4), -- Spitball слаб к электричеству
                                                                (3, 2), -- Grumble слаб к взрывам
                                                                (4, 5),
                                                                (2, 1);

-- Сильные стороны монстров
INSERT INTO monster_strengths (monster_id, impact_type_id) VALUES
                                                               (1, 3), -- Dreadnought устойчив к кинетике
                                                               (2, 3), -- Spitball устойчив к кинетике
                                                               (4, 1); -- Hulk устойчив к огню

-- Миссии
INSERT INTO missions (name, biome_id, description, team_id, required_experience, status, mission_start, mission_end) VALUES
                                                                                                                         ('Deep Core Extraction',      1, 'Mine Deep Core samples in Salt Pits.',                1, 80, 'IN_PROGRESS',   '2025-10-20 08:00:00', '2025-10-20 16:00:00'),
                                                                                                                         ('Crystal Harvest',           2, 'Collect rare crystals in Crystalline Caves.',         1, 90, 'CREATED',  '2025-10-22 07:00:00', '2025-10-22 15:00:00'),
                                                                                                                         ('Sandstorm Recon',           3, 'Map unstable corridors in Astraeus desert.',           2, 10, 'CREATED',  '2025-10-24 09:00:00', '2025-10-24 17:00:00'),
                                                                                                                         ('Rad-Zone Cleanup',          4, 'Eliminate mutated threats in exclusion zone.',        2, 10, 'CREATED',  '2025-10-26 08:30:00', '2025-10-26 16:30:00');

-- Запросы
INSERT INTO requests (sender_department, recipient_department, request_code, description, sender_employee_id)
VALUES
    ('Logistics', 'Armory', 'REQ-001', 'Request additional Boomsticks', 1),
    ('Engineering', 'Supply Chain', 'REQ-002', 'Need more Ziplines', 4),
    ('Field Ops', 'Medical', 'REQ-003', 'Emergency medpack resupply', 2),
    ('Command', 'Logistics', 'REQ-004', 'Priority delivery to Drop Pod', NULL),
    ('Armory', 'Engineering', 'REQ-005', 'Repair parts for Flamethrowers', 3);

-- Космические корабли
INSERT INTO space_ship (name, lifting_capacity) VALUES
                                                    ('Rockford',     5000.000),
                                                    ('Stonebreaker', 3500.000),
                                                    ('Mule-7',       2000.000);

-- Логистика
INSERT INTO logistics (start_time, cargo_id, space_ship_id, status) VALUES
                                                                        ('2025-10-19 14:00:00', 1, 1, 'Shipping'),
                                                                        ('2025-10-21 10:00:00', 2, 2, 'Created'),
                                                                        ('2025-10-23 11:00:00', 4, 3, 'Created');