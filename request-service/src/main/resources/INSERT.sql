-- Планеты
INSERT INTO planets (name) VALUES 
('Hoxxes IV'),
('Astraeus'),
('Feydor');

-- Типы воздействия
INSERT INTO impact_types (name) VALUES 
('Fire'),
('Explosive'),
('Kinetic'),
('Electric'),
('Acid');

-- Точки доставки
INSERT INTO delivery_point (delivery_type) VALUES 
('Warehouse'),            -- 1
('Biome Entrance'),       -- 2
('Spaceport'),            -- 3
('Forward Base'),         -- 4
('Drop Pod');             -- 5

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
('Deep Core Relay', 1, 'Communication', 'Active', 3),
('Orbital Drop Hub', 2, 'Dropship', 'Active', 3),
('Emergency Evac Station', 3, 'Evacuation', 'Standby', 3);

-- Сотрудники с хешированными паролями
INSERT INTO employees (name, password, post, experience, status, hired_date) VALUES 
('Rourke', 'rocknstone', 'Driller',   120, 'active', '2023-01-15'),
('Maggie', 'zoomzoom', 'Scout',     95,  'active', '2023-03-22'),
('Berg', 'boomstick', 'Gunner',    110, 'active', '2022-11-10'),
('Daisy', 'buildit', 'Engineer',  105, 'active', '2023-02-01'),
('Lars', 'fastfast', 'Scout',     40,  'active', '2024-01-10'),
('Gunnar', 'digdeep', 'Driller',   30,  'active', '2024-02-15'),
('Sven', 'turretup', 'Engineer',  25,  'active', '2024-03-01'),
('Thor', 'hammerdown', 'Gunner',    50,  'active', '2023-12-05');

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
('Deep Core Extraction',      1, 'Mine Deep Core samples in Salt Pits.',                1, 80, 'Active',   '2025-10-20 08:00:00', '2025-10-20 16:00:00'),
('Crystal Harvest',           2, 'Collect rare crystals in Crystalline Caves.',         1, 90, 'Planned',  '2025-10-22 07:00:00', '2025-10-22 15:00:00'),
('Sandstorm Recon',           3, 'Map unstable corridors in Astraeus desert.',           2, 10, 'Planned',  '2025-10-24 09:00:00', '2025-10-24 17:00:00'),
('Rad-Zone Cleanup',          4, 'Eliminate mutated threats in exclusion zone.',        2, 10, 'Planned',  '2025-10-26 08:30:00', '2025-10-26 16:30:00');

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

