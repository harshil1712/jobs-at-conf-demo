DROP TABLE IF EXISTS jobs;

CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_key TEXT NOT NULL UNIQUE,
    job_role TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    job_description TEXT,
    hiring_company TEXT,
    job_apply TEXT
);