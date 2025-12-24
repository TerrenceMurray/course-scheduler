DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'scheduler') THEN
        DROP TYPE IF EXISTS scheduler.course_session_type;
        DROP TABLE IF EXISTS scheduler.room_types;
    END IF;
END $$;
