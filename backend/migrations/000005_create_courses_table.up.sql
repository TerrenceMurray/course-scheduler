CREATE TABLE scheduler.courses (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TRIGGER update_courses_timestamp
BEFORE UPDATE ON scheduler.courses
FOR EACH ROW
EXECUTE FUNCTION scheduler.update_timestamp();