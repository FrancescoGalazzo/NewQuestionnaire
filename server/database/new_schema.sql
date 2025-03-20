BEGIN TRANSACTION;

-- Table: admin
CREATE TABLE IF NOT EXISTS "admin" (
    "id"    INTEGER NOT NULL,
    "user"  TEXT NOT NULL,
    "hash"  TEXT NOT NULL,
    "color" TEXT,
    PRIMARY KEY("id")
);

-- Table: questionnaires
CREATE TABLE IF NOT EXISTS questionnaires (
    qid INTEGER PRIMARY KEY,
    admin INTEGER NOT NULL,
    title TEXT NOT NULL,
    num_questions INTEGER CHECK(num_questions >= 0),
    num_users INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(admin) REFERENCES admin(id)
);

-- Table: questions
CREATE TABLE IF NOT EXISTS questions (
    did INTEGER PRIMARY KEY,
    questionnaire INTEGER NOT NULL,
    query TEXT NOT NULL,
    type INTEGER NOT NULL CHECK(type IN (0,1)), -- e.g. 0=closed, 1=open
    required BOOLEAN NOT NULL DEFAULT FALSE,
    min INTEGER CHECK(min >= 0),
    max INTEGER CHECK(max >= min),
    FOREIGN KEY(questionnaire) REFERENCES questionnaires(qid)
);

-- Table: question_options
CREATE TABLE IF NOT EXISTS question_options (
    id INTEGER PRIMARY KEY,
    question INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    position INTEGER NOT NULL, -- order of options
    FOREIGN KEY(question) REFERENCES questions(did)
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    questionnaire INTEGER NOT NULL,
    FOREIGN KEY(questionnaire) REFERENCES questionnaires(qid)
);

-- Table: answers
CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY,
    question INTEGER NOT NULL,
    user INTEGER NOT NULL,
    open_answer TEXT, -- used only for open questions
    FOREIGN KEY(question) REFERENCES questions(did),
    FOREIGN KEY(user) REFERENCES users(id)
);

-- Table: answer_options
CREATE TABLE IF NOT EXISTS answer_options (
    answer INTEGER NOT NULL,
    chosen_option INTEGER NOT NULL,
    PRIMARY KEY(answer, chosen_option),
    FOREIGN KEY(answer) REFERENCES answers(id),
    FOREIGN KEY(chosen_option) REFERENCES question_options(id)
);

-- Insert Admin1
INSERT INTO admin (id, user, hash, color) 
VALUES (1, 'admin1', 'test1', 'blue');

-- Insert Admin2
INSERT INTO admin (id, user, hash, color) 
VALUES (2, 'admin2', 'test2', 'red');

-- Insert Questionnaire
INSERT INTO questionnaires (qid, admin, title, num_questions) 
VALUES (1, 1, 'Survey Example', 3);

-- Insert Questions
-- Question 1: Closed with 2 options
INSERT INTO questions (did, questionnaire, query, type, required, min, max) 
VALUES (1, 1, 'What is your favorite color?', 0, TRUE, 1, 1);

-- Question 2: Closed with 3 options
INSERT INTO questions (did, questionnaire, query, type, required, min, max) 
VALUES (2, 1, 'What is your favorite fruit?', 0, TRUE, 1, 2);

-- Question 3: Open-ended
INSERT INTO questions (did, questionnaire, query, type, required) 
VALUES (3, 1, 'Describe your ideal vacation.', 1, FALSE);

-- Insert Options for Closed Questions
-- Options for Question 1
INSERT INTO question_options (id, question, option_text, position) 
VALUES 
(1, 1, 'Blue', 1),
(2, 1, 'Red', 2);

-- Options for Question 2
INSERT INTO question_options (id, question, option_text, position) 
VALUES 
(3, 2, 'Apple', 1),
(4, 2, 'Banana', 2),
(5, 2, 'Orange', 3);

INSERT INTO users (id, name, questionnaire) 
VALUES (1, 'User1', 1);

INSERT INTO answers (id, question, user) 
VALUES (1, 1, 1);

INSERT INTO answer_options (answer, chosen_option) 
VALUES (1, 1);

INSERT INTO answers (id, question, user) 
VALUES (2, 2, 1);

INSERT INTO answer_options (answer, chosen_option) 
VALUES 
(2, 3),
(2, 4);

-- INSERT INTO answers (id, question, user, open_answer) 
-- VALUES (3, 3, 1, 'A beach holiday with family.');


COMMIT;
