-- TravelTech Global Hubs Initialization

CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    utc_offset INTEGER NOT NULL -- offset in hours
);

INSERT INTO cities (name, country, latitude, longitude, utc_offset) VALUES
('New York', 'USA', 40.7128, -74.0060, -5),
('London', 'UK', 51.5074, -0.1278, 0),
('Paris', 'France', 48.8566, 2.3522, 1),
('Berlin', 'Germany', 52.5200, 13.4050, 1),
('Tokyo', 'Japan', 35.6895, 139.6917, 9),
('Dubai', 'UAE', 25.2048, 55.2708, 4),
('Singapore', 'Singapore', 1.3521, 103.8198, 8),
('Sydney', 'Australia', -33.8688, 151.2093, 11),
('Madrid', 'Spain', 40.4168, -3.7038, 1),
('Mexico City', 'Mexico', 19.4326, -99.1332, -6),
('Buenos Aires', 'Argentina', -34.6037, -58.3816, -3),
('Hong Kong', 'China', 22.3193, 114.1694, 8),
('Mumbai', 'India', 19.0760, 72.8777, 5),
('Cairo', 'Egypt', 30.0444, 31.2357, 2),
('Sao Paulo', 'Brazil', -23.5505, -46.6333, -3),
('Seoul', 'South Korea', 37.5665, 126.9780, 9);

-- Initial Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itineraries Table
CREATE TABLE IF NOT EXISTS itineraries (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destinations JSONB NOT NULL,
    strategy VARCHAR(20) NOT NULL,
    budget DOUBLE PRECISION NOT NULL,
    total_cost DOUBLE PRECISION,
    total_time DOUBLE PRECISION,
    result JSONB,
    status VARCHAR(20) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
