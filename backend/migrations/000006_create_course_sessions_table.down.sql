DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'scheduler') THEN
        DROP TABLE IF EXISTS scheduler.schedules;
        DROP TABLE IF EXISTS scheduler.course_sessions;
    END IF;
END $$;
