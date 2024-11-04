DROP TABLE IF EXISTS packs CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS actions CASCADE;
DROP TABLE IF EXISTS access_shared CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS otps CASCADE;


CREATE TABLE packs(
    id SERIAL PRIMARY KEY,
    pack TEXT,
    storage INTEGER,
    cost TEXT
);

CREATE TABLE divisions(
    id SERIAL PRIMARY KEY,
    division VARCHAR,
    division_address TEXT
);

CREATE TABLE mountpoints(
    id SERIAL PRIMARY KEY,
    mountpoint VARCHAR,
    active INTEGER DEFAULT 1
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
    bookmark INTEGER,
    is_deleted INTEGER,
    folder_size INTEGER,
    parent INTEGER DEFAULT NULL,
    FOREIGN KEY (parent) REFERENCES folders(id),
    created_at TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE subscriptions(
    id SERIAL PRIMARY KEY,
    subscription INTEGER,
    FOREIGN KEY (subscription) REFERENCES packs(id),
    user_id INTEGER,
    FOREIGN KEY (users) REFERENCES users(id),
    mountpoint INTEGER,
    FOREIGN KEY (mountpoint) REFERENCES mountpoints(id),
    folder INTEGER,
    FOREIGN KEY (folder) REFERENCES folders(id)
);


CREATE TABLE files(
    id SERIAL PRIMARY KEY,
    file_name VARCHAR,
    bookmark INTEGER,
    is_deleted INTEGER,
    file_size INTEGER,
    parent_folder INTEGER,
    FOREIGN KEY (parent_folder) REFERENCES folders(id),
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


CREATE TABLE otps(
    id SERIAL PRIMARY KEY,
    otp_code VARCHAR,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    expires_in TIMESTAMP,
    expired INTEGER
);

CREATE TABLE notifications(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    title TEXT,
    info TEXT
);