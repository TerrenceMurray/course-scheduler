-- Skip if schema doesn't exist (handled by 000000_init_schema.down.sql CASCADE)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'scheduler') THEN
        ALTER TABLE IF EXISTS scheduler.rooms DROP CONSTRAINT IF EXISTS CHK_RoomCapacity;
        DROP TRIGGER IF EXISTS update_rooms_timestamp ON scheduler.rooms;
        DROP TABLE IF EXISTS scheduler.rooms;
        DROP TABLE IF EXISTS scheduler.buildings;
    END IF;
END $$;
