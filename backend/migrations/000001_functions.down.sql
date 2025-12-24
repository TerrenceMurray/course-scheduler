DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'scheduler') THEN
        DROP FUNCTION IF EXISTS scheduler.update_timestamp();
    END IF;
END $$;
