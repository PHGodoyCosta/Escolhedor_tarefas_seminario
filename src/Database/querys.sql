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

INSERT INTO jobber (hash, name) VALUES ('d7f7ef9f-23e3-4b3f-a55d-98f0803990ec', 'Pedro Augusto');

INSERT INTO jobber (hash, name) VALUES ('820fa4d7-f9e5-45eb-a9f9-341284ecd5b1', 'Pedro Godoy');

INSERT INTO jobber (hash, name) VALUES ('93257ced-80bd-4aa5-9360-51b201060664', 'David');

INSERT INTO jobber (hash, name) VALUES ('db6eaad2-c960-4d94-b389-99156a126ee9', 'Marcos');

INSERT INTO jobber (hash, name) VALUES ('0c07e550-dd9c-4e42-a165-198d273c2bea', 'Breno Texeira');

INSERT INTO jobber (hash, name) VALUES ('a00cfbcf-a47c-4845-bbc5-6b30944e1835', 'Rafael');

INSERT INTO jobber (hash, name) VALUES ('42bc928e-a7ce-422f-97b9-7218ff936cb2', 'Enrique');

-- INSERT INTO jobber (hash, name) VALUES ('e18255db-d7a3-4ba6-b9f7-8ea9883b0f63', 'Igor');

INSERT INTO jobber (hash, name) VALUES ('94a49f95-5d81-491d-bf6a-3e6229c4fd52', 'Gustavo');

INSERT INTO jobber (hash, name) VALUES ('b565ad72-f9e4-422d-9f4c-0a44c1cd0e4a', 'Rael');

INSERT INTO workspaces (hash, name) VALUES ('a384ba55-fc52-4651-a960-e7d59748efbf', 'Trabalhos Internos');

INSERT INTO workspaces (hash, name) VALUES ('d79857ca-52dc-402a-9882-32f251d5f98d', 'Trabalhos Externos');

INSERT INTO workspaces (hash, name) VALUES ('55f2f46d-f5be-44c3-a130-28bb927cd8d7', 'Trabalhos Oração');

-- Trabalhos Internos

INSERT INTO jobs (hash, name, workspace_id, num_jobbers, sort_order) VALUES ('6704bf02-4a0f-4057-94ec-304f0e8cc726', 'Cozinha', 1, 4, 2);

INSERT INTO jobs (hash, name, workspace_id, num_jobbers, sort_order) VALUES ('f3f12d3b-123f-4245-97d4-924da3371873', 'Servente', 1, 1, 4);

INSERT INTO jobs (hash, name, workspace_id, num_jobbers, sort_order) VALUES ('b3cf991d-f4c6-4332-85b7-7c3fe8ba5beb', 'Louça', 1, 3, 3);

INSERT INTO jobs (hash, name, workspace_id, num_jobbers, sort_order) VALUES ('2e279f45-6c2a-42e4-bebd-0582c93505de', 'Disponível', 1, 1, 1);

-- Trabalhos Oração:

INSERT INTO jobs (hash, name, workspace_id, num_jobbers, sort_order) VALUES ('df8ae35a-91c8-4f96-95da-3b44f0f4943c', 'Missa', 3, 2, 1);

INSERT INTO jobs (hash, name, workspace_id, num_jobbers, sort_order) VALUES ('009d67e0-52ab-460e-8787-b2f9982a4ebf', 'Oração', 3, 2, 2);


-- INSERT INTO relation_jobber_jobs (jobber_id, job_id) VALUES (2, 1);