DROP TABLE IF EXISTS packs CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS actions CASCADE;
DROP TABLE IF EXISTS access_shared CASCADE;
DROP TABLE IF EXISTS activities CASCADE;

CREATE TABLE packs(
    id SERIAL PRIMARY KEY,
    pack TEXT,
    storage INTEGER,
    cost TEXT
);

CREATE TABLE divisions(
    id SERIAL PRIMARY KEY,
    division TEXT,
    division_address TEXT
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR,
    pass VARCHAR,
    email VARCHAR,
    phone_number VARCHAR,
    last_login TEXT,
    division INTEGER,
    storage INTEGER,
    FOREIGN KEY (division) REFERENCES divisions(id),
    pack INTEGER,
    FOREIGN KEY (pack) REFERENCES packs(id)
);


CREATE TABLE folders(
    id SERIAL PRIMARY KEY,
    folder_name TEXT,
    folder_path TEXT,
    folder_size INTEGER,
    parent INTEGER DEFAULT NULL,
    FOREIGN KEY (parent) REFERENCES folders(id),
    created_at TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE files(
    id SERIAL PRIMARY KEY,
    file_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    folder_name INTEGER,
    FOREIGN KEY (folder_name) REFERENCES folders(id),
    created_at TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE actions(
    id SERIAL PRIMARY KEY,
    action_name TEXT
);

CREATE TABLE access_shared(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP,
    created_by INTEGER,
    file_id INTEGER,
    folder_id INTEGER,
    FOREIGN KEY (file_id) REFERENCES files(id),
    FOREIGN KEY (folder_id) REFERENCES folders(id),
    action_type INTEGER,
    FOREIGN KEY (action_type) REFERENCES actions(id),
    shared_to INTEGER,
    FOREIGN KEY (shared_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    expires_at TIMESTAMP
);

CREATE TABLE activities(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    file_id INTEGER,
    folder_id INTEGER,
    FOREIGN KEY (file_id) REFERENCES files(id),
    FOREIGN KEY (folder_id) REFERENCES folders(id),
    action_type INTEGER,
    FOREIGN KEY (action_type) REFERENCES actions(id),
    created_at TIMESTAMP
);

