CREATE DATABASE IF NOT EXISTS calendar_app;
USE calendar_app;

-- Create the events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL
);

-- Remove the old 'event' column (if it exists) 
ALTER TABLE events
DROP COLUMN IF EXISTS event;

-- Add the new columns
ALTER TABLE events
ADD COLUMN event_title VARCHAR(255) NOT NULL,
ADD COLUMN event_description TEXT;
