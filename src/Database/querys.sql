CREATE TABLE workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    name TEXT NOT NULL,
    workspace_id INTEGER,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);

CREATE TABLE jobber (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE relation_jobber_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobber_id INTEGER,
    job_id INTEGER,
    FOREIGN KEY (jobber_id) REFERENCES jobber(id),
    FOREIGN KEY (job_id) REFERENCES job(id)
);

SELECT * FROM jobbers;