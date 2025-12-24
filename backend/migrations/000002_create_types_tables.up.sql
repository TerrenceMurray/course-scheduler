CREATE TABLE scheduler.room_types (
    name VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TYPE scheduler.course_session_type AS ENUM ('lab', 'tutorial', 'lecture');