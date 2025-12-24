DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'scheduler') THEN
        DROP TABLE IF EXISTS scheduler.courses;
    END IF;
END $$;
