-- Планеты
INSERT INTO planets (name) VALUES
                               ('Hoxxes IV'),
                               ('Gale Cradle'),
                               ('The Sprawl');

-- Типы воздействия
INSERT INTO impact_types (name) VALUES
                                    ('Fire'),
                                    ('Explosive'),
                                    ('Kinetic'),
                                    ('Electric'),
                                    ('Cryo'),
                                    ('Acid'),
                                    ('Radioactive');

-- Точки доставки (ТОЛЬКО WAREHOUSE, BIOME, STATION)
INSERT INTO delivery_point (delivery_type) VALUES
                                               ('WAREHOUSE'),  -- 1
                                               ('BIOME'),      -- 2
                                               ('STATION'),    -- 3
                                               ('STATION'),    -- 4
                                               ('BIOME');      -- 5

-- Биомы (только BIOME точки)
INSERT INTO biomes (name, description, planet_id, delivery_point_id) VALUES
                                                                         ('Crystalline Caverns',
                                                                          'Glittering crystal caves on Hoxxes IV, filled with Glyphid infestations.', 1, 2),
                                                                         ('Salt Pits',
                                                                          'Deep salt formations with unstable terrain and heavy swarm activity.', 1, 5),
                                                                         ('Radioactive Exclusion Zone',
                                                                          'Irradiated wasteland with mutated wildlife and lethal hotspots.', 1, 2),
                                                                         ('Sandblasted Corridors',
                                                                          'Wind-carved tunnels with low visibility and frequent cave-ins.', 2, 5),
                                                                         ('Fungus Bogs',
                                                                          'Toxic fungal swamps with corrosive spores and dense growth.', 1, 2);

-- Склады (только WAREHOUSE)
INSERT INTO warehouses (name, delivery_point_id) VALUES
                                                     ('Main Space Rig Storage', 1),
                                                     ('Forward Supply Depot Hoxxes', 1),
                                                     ('Emergency Reserve Vault', 1);

-- Станции (только STATION)
INSERT INTO stations (name, planet_id, type, status, delivery_point_id) VALUES
                                                                            ('Deep Rock Main Rig Korlok', 1, 'COMMUNICATION', 'ACTIVE', 3),
                                                                            ('Hoxxes Mining Outpost Alpha', 1, 'MINING', 'ACTIVE', 3),
                                                                            ('Defense Platform Sigma', 1, 'MILITARY', 'UNDER_CONSTRUCTION', 4),
                                                                            ('Remote Research Platform', 2, 'COMMUNICATION', 'ACTIVE', 4);

-- Сотрудники
INSERT INTO employees (name, post, department, experience, status, hired_date) VALUES
-- Miner Team (дворфы)
('Karl Ironfist',     'Driller',   'Miner Team',        200, 'ACTIVE', '2020-03-01'),
('Morkin Blastbeard', 'Gunner',    'Miner Team',        150, 'ACTIVE', '2021-06-15'),
('Bjorn Gearfix',     'Engineer',  'Miner Team',        130, 'ACTIVE', '2022-01-10'),
('Thrain Quickshot',  'Scout',     'Miner Team',        140, 'ACTIVE', '2021-11-05'),

-- Mission Control
('Lloyd MissionOp',   'Operator',  'Mission Control',   220, 'ACTIVE', '2019-09-01'),
('Klara MissionPlan', 'Planner',   'Mission Control',   180, 'ACTIVE', '2021-02-20'),

-- ScanCom
('Iris Scanner',      'Scan Officer', 'ScanCom',        160, 'ACTIVE', '2022-05-17'),

-- Management
('Hagen Director',    'Director',  'Management',        300, 'ACTIVE', '2015-01-01'),
('Elena HRManager',   'HR Manager', 'Management',       120, 'ACTIVE', '2022-09-12'),

-- R&D
('Dr.Vex',            'Lead Researcher', 'R&D',         210, 'ACTIVE', '2018-04-23'),
('Dr.Midas',          'Weapon Scientist','R&D',         190, 'ACTIVE', '2019-07-30'),

-- Science Department
('Prof.Luna',         'Xenogeologist', 'Science Department', 175, 'ACTIVE', '2020-05-10'),
('Dr.Zara',           'Biologist', 'Science Department', 155, 'ACTIVE', '2021-08-20'),

-- Launch Control
('Rex LaunchCoord',   'Coordinator','Launch Control',   165, 'ACTIVE', '2021-12-01'),

-- Maintenance
('Rusty Gearwrench',  'Chief Mechanic','Maintenance',  170, 'ACTIVE', '2020-08-08'),
('Greta Sparkfix',    'Technician', 'Maintenance',     140, 'ACTIVE', '2021-12-03');

-- Роли
INSERT INTO roles (name) VALUES
                             ('ROLE_ADMIN'),
                             ('ROLE_USER'),
                             ('ROLE_MANAGEMENT_EMPLOYEE'),
                             ('ROLE_MISSION_CONTROL_EMPLOYEE'),
                             ('ROLE_SCANCOM_EMPLOYEE'),
                             ('ROLE_RND_EMPLOYEE'),
                             ('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE'),
                             ('ROLE_LAUNCH_CONTROL_EMPLOYEE'),
                             ('ROLE_MAINTENANCE_EMPLOYEE'),
                             ('ROLE_MINER_EMPLOYEE');

-- Пользователи (хеши заглушки bcrypt)
INSERT INTO users (employee_id, username, password_hash, salt, created_at, is_active) VALUES
                                                                                          (1,  'karl',     '$2a$10$examplehashkarlminer1234567890abcdef', 'karl_salt',   '2020-03-01 10:00:00', TRUE),
                                                                                          (2,  'morkin',   '$2a$10$examplehashmorkingunner1234567890ab', 'morkin_salt', '2021-06-15 10:00:00', TRUE),
                                                                                          (3,  'bjorn',    '$2a$10$examplehashbjornengineer123456789ab', 'bjorn_salt',  '2022-01-10 10:00:00', TRUE),
                                                                                          (4,  'thrain',   '$2a$10$examplehashthrainscout1234567890abc', 'thrain_salt', '2021-11-05 10:00:00', TRUE),
                                                                                          (5,  'lloyd',    '$2a$10$examplehashlloydmission1234567890ab', 'lloyd_salt',  '2019-09-01 10:00:00', TRUE),
                                                                                          (6,  'klara',    '$2a$10$examplehashklaramission1234567890ab', 'klara_salt',  '2021-02-20 10:00:00', TRUE),
                                                                                          (7,  'iris',     '$2a$10$examplehashirisscancom1234567890abc', 'iris_salt',   '2022-05-17 10:00:00', TRUE),
                                                                                          (8,  'hagen',    '$2a$10$examplehashhagenmanagement123456789', 'hagen_salt',  '2015-01-01 10:00:00', TRUE),
                                                                                          (9,  'elena',    '$2a$10$examplehashelenahr1234567890abcdefg', 'elena_salt',  '2022-09-12 10:00:00', TRUE),
                                                                                          (10, 'vex',      '$2a$10$examplehashdrvextrnd1234567890abcde', 'vex_salt',    '2018-04-23 10:00:00', TRUE),
                                                                                          (11, 'midas',    '$2a$10$examplehashdrmidasrnd1234567890abcd', 'midas_salt',  '2019-07-30 10:00:00', TRUE),
                                                                                          (12, 'luna',     '$2a$10$examplehashproflunascience123456789', 'luna_salt',   '2020-05-10 10:00:00', TRUE),
                                                                                          (13, 'zara',     '$2a$10$examplehashdrzarascience1234567890a', 'zara_salt',   '2021-08-20 10:00:00', TRUE),
                                                                                          (14, 'rex',      '$2a$10$examplehashrexlaunch1234567890abcde', 'rex_salt',    '2021-12-01 10:00:00', TRUE),
                                                                                          (15, 'rusty',    '$2a$10$examplehashrustymaintenance12345678', 'rusty_salt',  '2020-08-08 10:00:00', TRUE),
                                                                                          (16, 'greta',    '$2a$10$examplehashgretamaintenance1234567', 'greta_salt',  '2021-12-03 10:00:00', TRUE);

-- Назначение ролей (некоторым несколько ролей)
INSERT INTO user_roles (user_id, role_id) VALUES
-- Miner Team (ROLE_MINER_EMPLOYEE)
(1,  10), -- Karl
(2,  10), -- Morkin
(3,  10), -- Bjorn
(4,  10), -- Thrain

-- Mission Control
(5,  4),  -- Lloyd
(6,  4),  -- Klara

-- ScanCom
(7,  5),  -- Iris

-- Management (ROLE_ADMIN + своя роль)
(8,  1),  -- Hagen: ADMIN + Management
(8,  3),
(9,  3),  -- Elena: Management

-- R&D
(10, 6),  -- Vex
(11, 6),  -- Midas

-- Science Department
(12, 7),  -- Luna
(13, 7),  -- Zara

-- Launch Control
(14, 8),  -- Rex

-- Maintenance
(15, 9),  -- Rusty
(16, 9);  -- Greta

-- Команды (located_at = WAREHOUSE или STATION)
INSERT INTO teams (name, cargo_id, located_at, status) VALUES
                                                           ('Team Rock & Stone', null, 1, 'ON_MISSION'), -- WAREHOUSE
                                                           ('Team Deep Core',    null, 1, 'CREATED'),    -- WAREHOUSE
                                                           ('Team Backup Crew',  null, 3, 'CREATED');    -- STATION

-- Члены команд
INSERT INTO team_members (team_id, employee_id) VALUES
                                                    (1, 1), (1, 2), (1, 3), (1, 4), -- Rock & Stone
                                                    (2, 1), (2, 2),                -- Deep Core (меньше 4)
                                                    (3, 3);                         -- Backup

-- weapon_info
INSERT INTO weapon_info (name, description, weight, impact_type) VALUES
                                                                     ('Drillsword',   'Melee cutting drill weapon', 8.500, 3), -- Kinetic
                                                                     ('Boomstick',    'Double-barrel shotgun',       6.200, 2), -- Explosive
                                                                     ('Zhukov',       'Twin submachine guns',        4.800, 3),
                                                                     ('PGL',          'Grenade launcher',            9.100, 2),
                                                                     ('Flamethrower', 'Incendiary area denial',      7.300, 1); -- Fire

-- equipment_info
INSERT INTO equipment_info (name, description, weight) VALUES
                                                           ('Flame Turret',  'Deployable fire turret',     12.000),
                                                           ('Zipline',       'Rapid traversal tool',        3.500),
                                                           ('Platform Gun',  'Creates walkable platforms',  5.000),
                                                           ('Sentry Gun',    'Auto-targeting turret',      10.000),
                                                           ('Bubble Shield', 'Protective energy barrier',   6.000);

-- weapons (located_at = WAREHOUSE/STATION)
INSERT INTO weapons (name, identification_number, located_at, cargo_id, status, date) VALUES
                                                                                          ('Drillsword',   'DS-001', 1, null, 'STORED', '2025-10-15 10:00:00'),
                                                                                          ('Boomstick',    'BS-001', 1, null, 'STORED', '2025-10-15 10:05:00'),
                                                                                          ('Zhukov',       'ZUK-001',1, null, 'STORED', '2025-10-15 10:10:00'),
                                                                                          ('PGL',          'PGL-001',3, null, 'STORED', '2025-10-16 09:00:00'),
                                                                                          ('Flamethrower', 'FT-001', 3, null, 'STORED', '2025-10-16 09:15:00');

-- equipment
INSERT INTO equipment (name, identification_number, located_at, cargo_id, status, date) VALUES
                                                                                            ('Flame Turret',  'FT-001', 1, null, 'STORED', '2025-10-15 11:00:00'),
                                                                                            ('Zipline',       'ZP-001', 1, null, 'STORED', '2025-10-15 11:05:00'),
                                                                                            ('Platform Gun',  'PG-001', 3, null, 'STORED', '2025-10-16 09:30:00'),
                                                                                            ('Sentry Gun',    'SG-001', 3, null, 'STORED', '2025-10-16 09:35:00'),
                                                                                            ('Bubble Shield', 'BS-001', 3, null, 'STORED', '2025-10-16 09:40:00');

-- resource_info
INSERT INTO resource_info (name, description, weight_per_unit) VALUES
                                                                   ('Gold',   'Precious corporate profit metal', 0.500),
                                                                   ('Morkite','Primary mining objective ore',    0.300),
                                                                   ('Nitra',  'Fuel resource for drop pod',      0.200);

-- resources
INSERT INTO resources (name, located_at, cargo_id, status, date, quantity) VALUES
                                                                               ('Gold',   1, null, 'STORED', '2025-10-19 12:00:00', 100),
                                                                               ('Morkite',1, null, 'STORED', '2025-10-19 12:05:00', 250),
                                                                               ('Nitra',  3, null, 'STORED', '2025-10-19 12:10:00', 50);

-- monsters
INSERT INTO monsters (name, description, danger_level, heritage, monster_type, biome_id, armor_type) VALUES
                                                                                                         ('Glyphid Grunt',     'Common frontline attacker', 1, 'Glyphid', 'Swarm', 1, 'Chitin'),
                                                                                                         ('Glyphid Praetorian','Armored corrosive elite',   3, 'Glyphid', 'Elite', 1, 'Heavy Chitin'),
                                                                                                         ('Mactera Spitball',  'Flying acid shooter',       2, 'Mactera', 'Ranged',2, 'Soft'),
                                                                                                         ('Naedocyte Shocker', 'Electric stun jellyfish',   2, 'Naedocyte','Support',2, 'Ethereal'),
                                                                                                         ('Exploder',          'Suicidal explosive bug',    3, 'Glyphid', 'Suicide',3, 'Soft');

-- monster_weaknesses
INSERT INTO monster_weaknesses (monster_id, impact_type_id) VALUES
                                                                (1, 3), -- Grunt: Kinetic
                                                                (2, 1), -- Praetorian: Fire
                                                                (2, 4), -- Electric
                                                                (3, 4), -- Spitball: Electric
                                                                (3, 1), -- Fire
                                                                (4, 5), -- Shocker: Cryo
                                                                (5, 2); -- Exploder: Explosive

-- monster_strengths
INSERT INTO monster_strengths (monster_id, impact_type_id) VALUES
                                                               (2, 3), -- Praetorian: Kinetic resist
                                                               (3, 3), -- Spitball: Kinetic resist
                                                               (4, 4), -- Shocker: Electric resist
                                                               (5, 1); -- Exploder: Fire resist

-- missions
INSERT INTO missions (name, biome_id, description, team_id, required_experience, status, mission_start, mission_end) VALUES
                                                                                                                         ('Deep Core Extraction', 1, 'Mine Deep Core samples.', 1, 80, 'IN_PROGRESS', '2025-10-20 08:00:00', '2025-10-20 16:00:00'),
                                                                                                                         ('Crystal Harvest',      2, 'Collect rare crystals.', 1, 90, 'CREATED',     '2025-10-22 07:00:00', '2025-10-22 15:00:00'),
                                                                                                                         ('Sandstorm Recon',      3, 'Map unstable corridors.',2, 10, 'CREATED',     '2025-10-24 09:00:00', '2025-10-24 17:00:00'),
                                                                                                                         ('Rad-Zone Cleanup',     4, 'Eliminate mutated threats.',2,10,'CREATED',    '2025-10-26 08:30:00', '2025-10-26 16:30:00');

-- requests
INSERT INTO requests (sender_department, recipient_department, request_code, description, sender_employee_id, created_at, status) VALUES
                                                                                                                                      ('Logistics',   'Armory',       'REQ-RS', 'Request Boomsticks resupply',      1, '2025-10-19 14:00:00', 'CREATED'),
                                                                                                                                      ('Engineering', 'Supply Chain', 'REQ-EQ', 'Need Ziplines for next mission',   3, '2025-10-19 14:05:00', 'IN_PROGRESS'),
                                                                                                                                      ('Field Ops',   'Medical',      'REQ-MD', 'Emergency medpack delivery',       4, '2025-10-19 14:10:00', 'CREATED'),
                                                                                                                                      ('Command',     'Logistics',    'REQ-LG', 'Priority drop pod supplies',   NULL, '2025-10-19 14:15:00', 'CREATED'),
                                                                                                                                      ('Armory',      'Engineering',  'REQ-RP', 'Flamethrower repair parts',        2, '2025-10-19 14:20:00', 'SOLVED');

-- space_ship
INSERT INTO space_ship (name, lifting_capacity) VALUES
                                                    ('Rockford Mark VII', 5000.000),
                                                    ('Stonebreaker II',   3500.000),
                                                    ('Mule-7 Transport',  2000.000);

-- logistics
INSERT INTO logistics (send_time, cargo_id, space_ship_id, status) VALUES
                                                                       ('2025-10-19 14:00:00', 1, 1, 'SHIPPING'),
                                                                       ('2025-10-21 10:00:00', 2, 2, 'CREATED'),
                                                                       ('2025-10-23 11:00:00', 4, 3, 'READY');
