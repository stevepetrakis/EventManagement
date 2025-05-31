DROP TABLE IF EXISTS subscriber_requests;
DROP TABLE IF EXISTS subscriber_favourites;
DROP TABLE IF EXISTS subscriber_watch_history;
DROP TABLE IF EXISTS subscriber_notifications;
DROP TABLE IF EXISTS content_comments;
DROP TABLE IF EXISTS content_stats;
DROP TABLE IF EXISTS content;
DROP TABLE IF EXISTS content_creators;
DROP TABLE IF EXISTS event_chat;
DROP TABLE IF EXISTS event_stats;
DROP TABLE IF EXISTS event_teams;
DROP TABLE IF EXISTS team_performance;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS player_team_history;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS subscribers;
DROP TABLE IF EXISTS creators;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    date_of_birth DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creators (
    creator_id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE subscribers (
    subscriber_id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE team (
    team_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    game_playing VARCHAR(100) NOT NULL,
    year_of_foundation INT,
    `rank` INT,
    country VARCHAR(100),
    team_size INT
);

CREATE TABLE players (
    player_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50),
    age INT,
    current_team_id VARCHAR(10),
    FOREIGN KEY (current_team_id) REFERENCES team(team_id)
);

CREATE TABLE player_team_history (
    player_id VARCHAR(10),
    team_id VARCHAR(10),
    year INT,
    PRIMARY KEY (player_id, team_id, year),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES team(team_id)
);

CREATE TABLE team_performance (
    performance_id VARCHAR(10) PRIMARY KEY,
    team_id VARCHAR(10),
    description VARCHAR(255),
    year INT,
    FOREIGN KEY (team_id) REFERENCES team(team_id)
);

CREATE TABLE event (
    event_id VARCHAR(10) PRIMARY KEY,
    creator_id VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    game_type VARCHAR(50),
    category VARCHAR(50),
    status ENUM('live', 'upcoming', 'finished') DEFAULT 'upcoming',
    is_popular BOOLEAN DEFAULT FALSE,
    viewers FLOAT DEFAULT 0,
    image VARCHAR(255),
    price DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT,
    start_datetime DATETIME,
    end_datetime DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES creators(creator_id)
);

CREATE TABLE event_teams (
    event_id VARCHAR(10),
    team_id VARCHAR(10),
    PRIMARY KEY (event_id, team_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (team_id) REFERENCES team(team_id)
);

CREATE TABLE event_stats (
    event_stat_id VARCHAR(10) PRIMARY KEY,
    event_id VARCHAR(10),
    views INT DEFAULT 0,
    shares INT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES event(event_id)
);

CREATE TABLE event_chat (
    message_id VARCHAR(10) PRIMARY KEY,
    event_id VARCHAR(10),
    user_id VARCHAR(10),
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE content_creators (
    content_creator_id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE content (
    content_id VARCHAR(10) PRIMARY KEY,
    event_id VARCHAR(10),
    content_creator_id VARCHAR(10),
    title VARCHAR(100) NOT NULL,
    type ENUM('image', 'video', 'highlight') NOT NULL,
    url VARCHAR(255),
    description TEXT,
    scheduled_viewing_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (content_creator_id) REFERENCES content_creators(content_creator_id)
);

CREATE TABLE content_stats (
    content_stat_id VARCHAR(10) PRIMARY KEY,
    content_id VARCHAR(10),
    views INT DEFAULT 0,
    shares INT DEFAULT 0,
    likes INT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(content_id)
);

CREATE TABLE content_comments (
    comment_id VARCHAR(10) PRIMARY KEY,
    content_id VARCHAR(10),
    user_id VARCHAR(10),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(content_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE subscriber_notifications (
    notification_id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10),
    related_id VARCHAR(10),
    related_type ENUM('event', 'content'),
    description TEXT,
    type VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_seen BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE subscriber_requests (
    request_id VARCHAR(10) PRIMARY KEY,
    content_id VARCHAR(10),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(content_id)
);

CREATE TABLE subscriber_favourites (
    favorite_id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10),
    event_id VARCHAR(10),
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id)
);

CREATE TABLE subscriber_watch_history (
    history_id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10),
    event_id VARCHAR(10),
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id)
);

INSERT INTO users (user_id, first_name, last_name, username, password, email, date_of_birth)
VALUES 
('U001', 'Stavros', 'Petrakis', 'stavrPetr', '123qwe', 'stavros@gmail.com', '2002-05-13'),
('U002', 'Giorgos', 'Litsardakis', 'lits12', 'admin', 'lits@gmail.com', '2004-01-01'),
('U003', 'Raphael', 'Petrakis', 'raphPetr', 'user12', 'raph@gmail.com', '2004-02-02');

INSERT INTO creators (creator_id, user_id)
VALUES 
('C001', 'U001'),
('C002', 'U002');

INSERT INTO subscribers (subscriber_id, user_id)
VALUES 
('S001', 'U003');

INSERT INTO team (team_id, name, game_playing, year_of_foundation, `rank`, country, team_size)
VALUES 
('T001', 'SE PALMEIRAS', 'FIFA eWorld Cup', 2022, 3, 'Brazil', 5),
('T002', 'FC PORTO', 'FIFA eWorld Cup', 2021, 4, 'Portugal', 5),
('T003', 'Team Spirit', 'DOTA 2', 2015, 2, 'Russia', 5),
('T004', 'Gaimin Gladiators', 'DOTA 2', 2019, 5, 'International', 5),
('T005', 'NinjaKilla_212', 'Mortal Kombat 1', 2018, 1, 'USA', 1),
('T006', 'Rewind', 'Mortal Kombat 1', 2019, 8, 'USA', 1),
('T007', 'Atlanta FaZe', 'Call of Duty', 2019, 3, 'USA', 5),
('T008', 'OpTic Texas', 'Call of Duty', 2006, 2, 'USA', 5),
('T009', 'Navi', 'PUBG', 2009, 1, 'Ukraine', 4),
('T010', 'Liquid', 'PUBG', 2000, 2, 'Netherlands', 4),
('T011', 'T1', 'League of Legends', 2003, 1, 'South Korea', 5),
('T012', 'G2 Esports', 'League of Legends', 2015, 2, 'Europe', 5),
('T013', 'Lucas Blakeley', 'F1 Esports', 2017, 1, 'International', 3),
('T014', 'Jarno Opmeer', 'F1 Esports', 2019, 3, 'Netherlands', 1),
('T015', 'Fnatic', 'Valorant', 2011, 2, 'Europe', 5),
('T016', 'Paper Rex', 'Valorant', 2020, 4, 'Singapore', 5),
('T017', 'Bugha & Mero', 'Fortnite', 2017, null, 'USA', null),
('T018', 'Malibuca & ThomasHD', 'Fortnite', 2020, 3, 'Europe', 1),
('T019', '4 Merical Vibes', 'PUBG', 2017, null, 'South Korea', null),
('T020', 'Twisted Minds', 'PUBG', 2018, 6, 'Saudi Arabia', 4),
('T021', 'Team Vitality', 'Rocket League', 2015, null, 'USA', null),
('T022', 'Gen.G Mobil Racing', 'Rocket League', 2017, 2, 'South Korea', 3),
('T023', 'Dallas Fuel', 'Overwatch', 2017, 3, 'USA', 6),
('T024', 'Seoul Dynasty', 'Overwatch', 2017, 5, 'South Korea', 6),
('T025', 'San Francisco Shock', 'Overwatch', 2017, 1, 'USA', 6),
('T026', 'FaZe Clan', 'Counter-Strike', 2010, 4, 'USA', 5),
('T027', 'NAVI', 'Counter-Strike', 2011, 4, 'USA', 5),
('T028', '17 Gaming', 'PUBG', 2018, 3, 'China', 4),
('T029', 'Danawa e-sports', 'PUBG', 2019, 5, 'South Korea', 4);

INSERT INTO players (player_id, first_name, last_name, nickname, age, current_team_id)
VALUES 
('P001', 'Achraf', 'Hakimi', 'Hakimi', 26, 'T001'),
('P002', 'Christian', 'Pulisic', 'Pulisic', 26, 'T002'),
('P003', 'Raphael', 'Petrakis', 'R.Petrakis', 21, 'T001'),
('P004', 'Alessandro', 'Mercati', 'A.Mercati', 24, 'T001'),
('P005', 'Georgios', 'Liavas', 'G.Liavas', 25, 'T002'),
('P006', 'Nikolaos', 'Mirin', 'N.Mirin', 22, 'T001'),
('P007', 'Michalis', 'Bakakis', 'M.Bakakis', 27, 'T002'),
('P008', 'Georgios', 'Tsivelekidis', 'G.Tsivelekidis', 23, 'T001'),
('P009', 'Stefanos', 'Koutouris', 'S.Koutouris', 24, 'T002'),
('P010', 'Thanasis', 'Pasalidis', 'T.Pasalidis', 29, 'T002'),
('P011', 'Dominic', 'McLean', 'NinjaKilla_212', 24, 'T006'),
('P012', 'Rewind', 'Texas', 'Rewind', 23, 'T007'),
('P013', 'Red', 'Dragon', 'RedDragon345', 22, null),
('P014', 'River', 'Quiet', 'QuietRiver_TU', 25, null),
('P015', 'Pony', 'Prancing', 'PrancingPony', 21, null),
('P016', 'Harry', 'Potter', 'HarryP0ttah+7', 26, null),
('P017', 'Ahsoka', 'Tano', 'AshokaThaGreat', 23, null);

INSERT INTO event (event_id, creator_id, title, game_type, category, status, is_popular, viewers, image, price, description, start_datetime, end_datetime)
VALUES 
('E001', 'C001', 'FIFA eWorld Cup 2025', 'EA Sport FC', 'Group A', 'live', false, '396.4', 'foto_for_figma/fifa_25.png', 0.00, 'FIFA eWorld Cup 2025 Group A matches', '2025-05-20 19:30:00', ''),
('E002', 'C001', 'The International (TI)', 'DOTA 2', 'Best of 2 (Bo2)', 'live', false, '215.5', 'foto_for_figma/theInternational.jpg', 30.00, 'Team Spirit VS Gaimin Gladiators', '2025-05-20 20:00:00', ''),
('E003', 'C002', 'Mortal Kombat 1 Grand Finals', 'Mortal Kombat 1', 'Bracket Stage Top 8 Finals', 'live', false, '157.1', 'foto_for_figma/mortal_kombat.jpeg', 0.00, 'NinjaKilla_212 VS Rewind', '2025-05-20 18:00:00', ''),
('E004', 'C002', 'Call of Duty League 2025', 'Call of Duty: Modern Warfare lll', 'Best of 5 (Bo5)', 'live', false, '304.2', 'foto_for_figma/call_of_duty.jpeg', 25.00, 'Atlanta FaZe VS OpTic Texas', '2025-05-20 19:00:00', ''),
('E005', 'C001', 'PUBG Global Invitational 2025', 'PUBG: BATTLEGROUNDS', 'Qualifiers', 'live', false, '188.4', 'foto_for_figma/pubg1.jpeg', 0.00, 'Navi VS Liquid', '2025-05-20 17:00:00', ''),
('E006', 'C002', 'League of Legends Championship 2025', 'RIOT GAMES', 'Quartefinals', 'upcoming', false, '', 'foto_for_figma/lol_championship.jpg', 0.00, 'T1 VS G2 Esports', '2025-06-11 21:30:00', ''),
('E007', 'C001', 'F1 Esports Series 2025', 'FORMULA 1/EA SPORTS', 'Final Race - Abu Dhabi Circuit', 'upcoming', false, '', 'foto_for_figma/f1_esports.jpg', 10.00, 'Lucas Blakeley VS Jarno Opmeer', '2025-07-25 19:00:00', ''),
('E008', 'C002', 'Valorant Champions Tour 2025', 'RIOT GAMES', 'Upper Bracket Semifinal', 'upcoming', false, '', 'foto_for_figma/valorant.jpg', 12.00, 'Fnatic VS Paper Rex', '2025-08-04 20:00:00', ''),
('E009', 'C001', 'Fortnite Champions Series (FNCS) 2025', 'EPIC GAMES', 'Grand Finals - Duos', 'upcoming', false, '', 'foto_for_figma/fortnite.jpg', 0.00, 'Bugha & Mero VS Malibuca & ThomasHD', '2025-09-01 18:00:00', ''),
('E010', 'C002', 'PUBG Global Series 2025', 'KRAFTON/PUBG Esports', 'Group Stage - Map: Erangele', 'upcoming', false, '', 'foto_for_figma/pubg2.jpg', 0.00, '4 Merical Vibes VS Twisted Minds', '2025-06-18 17:00:00', ''),
('E011', 'C001', 'Rocket League World Championship 2025', 'Psyonix / Epic Games', 'Playoffs - Best of 7', 'upcoming', false, '', 'foto_for_figma/rocket.jpg', 0.00, 'Team Vitality VS Gen.G Mobil Racing', '2025-07-10 16:30:00', ''),
('E012', 'C002', 'Overwatch Champions Cup 2025', 'Blizzard Entertainment', 'Group B Match - Escort Map', 'upcoming', false, '', 'foto_for_figma/overwatchCup.jpg', 0.00, ' Dallas Fuel VS Seoul Dynasty', '2025-06-29 19:45:00', ''),
('E013', 'C001', 'PUBG Global Championship 2024', 'PUBG: Battlegrounds', 'Grand Final', 'finished', true, '', 'foto_for_figma/pubg.jpeg', 0.00, '17 Gaming VS Danawa e-sports (113 pts)', '2024-12-03 18:00:00', '2024-12-03 21:00:00'),
('E014', 'C002', 'Overwatch League 2025', 'Overwatch 2', 'West Region Semifinal', 'live', true, '598.9', 'foto_for_figma/Overwatch.jpeg', 0.00, 'San Francisco Shock VS Dallas Fuel (1:1)', '2025-05-20 15:00:00', ''),
('E015', 'C001', 'BLAST Premier World Final 2024', 'Counter-Strike: Global Offensive', 'Grand Final', 'finished', true, '', 'foto_for_figma/csgo.jpeg', 0.00, ' NAVI VS FaZe Clan (2:3)', '2024-12-17 16:00:00', '2024-12-17 20:00:00');

INSERT INTO event_teams (event_id, team_id)
VALUES 
('E001', 'T001'), ('E001', 'T002'),
('E002', 'T003'), ('E002', 'T004'),
('E003', 'T005'), ('E003', 'T006'),
('E004', 'T008'), ('E004', 'T007'),
('E005', 'T009'), ('E005', 'T010'),
('E006', 'T011'), ('E006', 'T012'),
('E007', 'T013'), ('E007', 'T014'),
('E008', 'T015'), ('E008', 'T016'),
('E009', 'T017'), ('E009', 'T018'),
('E010', 'T019'), ('E010', 'T020'),
('E011', 'T021'), ('E011', 'T022'),
('E012', 'T023'), ('E012', 'T024'),
('E013', 'T028'), ('E013', 'T029'),
('E014', 'T025'), ('E014', 'T023'),
('E015', 'T026'), ('E015', 'T027');

INSERT INTO event_stats (event_stat_id, event_id, views, shares)
VALUES 
('ES001', 'E001', 506400, 1200),
('ES002', 'E002', 215300, 850),
('ES003', 'E003', 157100, 600),
('ES004', 'E004', 201200, 780),
('ES005', 'E005', 138400, 520),
('ES006', 'E006', 0, 0),
('ES007', 'E007', 0, 0),
('ES008', 'E008', 0, 0),
('ES009', 'E009', 0, 0),
('ES010', 'E010', 0, 0),
('ES011', 'E011', 0, 0),
('ES012', 'E012', 0, 0),
('ES013', 'E013', 165000, 750),
('ES014', 'E014', 589900, 2100),
('ES015', 'E015', 420000, 1500);

INSERT INTO event_chat (message_id, event_id, user_id, message, created_at)
VALUES 
('M001', 'E001', 'U003', 'Hello @MultipleMean150 !! Glad to hear you feeling better', '2025-05-20 12:49:01'),
('M002', 'E001', 'U002', '!uptime', '2025-05-20 12:49:05'),
('M003', 'E001', 'U001', 'The uxus have come in the chat', '2025-05-20 12:49:12'),
('M004', 'E001', 'U003', 'Oh man', '2025-05-20 12:49:18'),
('M005', 'E001', 'U002', 'Hello !skill! Hello all!!', '2025-05-20 12:49:24'),
('M006', 'E001', 'U001', 'Thanks @SakeJo', '2025-05-20 12:49:30');

INSERT INTO player_team_history (player_id, team_id, year)
VALUES 
('P001', 'T001', 2023),
('P001', 'T001', 2022),
('P002', 'T002', 2024),
('P002', 'T001', 2022),
('P003', 'T001', 2024),
('P004', 'T001', 2023),
('P005', 'T002', 2024),
('P006', 'T001', 2023),
('P007', 'T002', 2024),
('P008', 'T001', 2022),
('P009', 'T002', 2023),
('P010', 'T002', 2022),
('P011', 'T006', 2021),
('P012', 'T007', 2022);

INSERT INTO content_creators (content_creator_id, user_id)
VALUES 
('CC001', 'U001'),
('CC002', 'U002'),
('CC003', 'U003');

INSERT INTO content (content_id, event_id, content_creator_id, title, type, url, description, scheduled_viewing_time, created_at, is_approved)
VALUES 
('CT001', 'E001', 'CC001', 'Paradisee', 'image', 'foto_for_figma/event1.jpeg', 'I wish everyone could experience what I''m feeling right now', '2025-05-20 19:35:00', '2025-05-20 19:32:00', TRUE),
('CT002', 'E001', 'CC002', 'It''s awesome', 'video', 'foto_for_figma/event2.jpeg', 'Unreal energy. Moments like this, stay with you forever', '2025-05-20 19:40:00', '2025-05-20 19:38:00', TRUE),
('CT003', 'E001', 'CC003', 'Amazing', 'highlight', 'foto_for_figma/event3.jpeg', 'Living the dream. This is what passion looks like', '2025-05-20 19:42:00', '2025-05-20 19:41:00', TRUE),
('CT004', 'E001', 'CC001', 'Just watch it', 'video', 'foto_for_figma/event4.jpg', 'Goosebumps. Just pure emotion here with my friends', '2025-05-20 19:45:00', '2025-05-20 19:43:00', TRUE),
('CT005', 'E001', 'CC002', 'Best Vibe', 'image', 'foto_for_figma/event.jpg', 'This isn''t just a game, it''s a whole vibe', '2025-05-20 19:48:00', '2025-05-20 19:46:00', TRUE);

INSERT INTO content_stats (content_stat_id, content_id, views, shares, likes, last_updated)
VALUES 
('CS001', 'CT001', 1250, 45, 120, '2025-05-20 19:50:00'),
('CS002', 'CT002', 980, 32, 95, '2025-05-20 19:50:00'),
('CS003', 'CT003', 1150, 38, 110, '2025-05-20 19:50:00'),
('CS004', 'CT004', 1420, 52, 140, '2025-05-20 19:50:00'),
('CS005', 'CT005', 890, 28, 85, '2025-05-20 19:50:00');