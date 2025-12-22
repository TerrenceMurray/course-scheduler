
-- scheduler schema define in 000001_create_types_tables

CREATE TABLE scheduler.building (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE scheduler.rooms (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    building UUID NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE scheduler.rooms ADD FOREIGN KEY (type) REFERENCES scheduler.room_types(name);
ALTER TABLE scheduler.rooms ADD FOREIGN KEY (building) REFERENCES scheduler.building(id);

ALTER TABLE scheduler.rooms 
ADD CONSTRAINT CHK_RoomCapacity CHECK (capacity>0);