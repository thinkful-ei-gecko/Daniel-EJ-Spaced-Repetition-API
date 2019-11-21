BEGIN;

TRUNCATE
  "word",
  "language",
  "users";

INSERT INTO "users" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'German', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'heute', 'today', 2),
  (2, 1, 'morgen', 'tomorrow', 3),
  (3, 1, 'gestern', 'yesterday', 4),
  (4, 1, 'die Woche', 'Week', 5),
  (5, 1, 'das Jahr', 'Year', 6),
  (6, 1, 'die Stunde', 'hour', 7),
  (7, 1, 'Guten Morgen', 'Good morning', 8),
  (8, 1, 'Taschenrechner', 'Calculator', 9),
  (9, 1, 'das Frühstück', 'breakfast', 10),
  (10, 1, 'das Abendessen', 'dinner', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));

COMMIT;
