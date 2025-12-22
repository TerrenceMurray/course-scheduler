-- Rollback: remove schedules and course_sessions tables
-- Drop in reverse order of creation to respect FK dependencies
DROP TABLE IF EXISTS scheduler.schedules;
DROP TABLE IF EXISTS scheduler.course_sessions;
