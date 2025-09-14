-- Таблица аэропортов (справочник)
CREATE TABLE airports (
  airport_id SERIAL PRIMARY KEY,
  airport_name VARCHAR(255) NOT NULL,
  airport_code VARCHAR(3) UNIQUE NOT NULL
);

-- Таблица пользователей (все роли)
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL CHECK (user_role IN ('user', 'cashier', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица воздушных судов (парк ВС)
CREATE TABLE aircrafts (
  aircraft_id SERIAL PRIMARY KEY,
  model VARCHAR(100) NOT NULL,
  aircraft_type VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired'))
);

-- Таблица рейсов (с множителями тарифов)
CREATE TABLE flights (
  flight_id SERIAL PRIMARY KEY,
  flight_number VARCHAR(10) NOT NULL,
  departure_airport_id INTEGER NOT NULL REFERENCES airports(airport_id),
  arrival_airport_id INTEGER NOT NULL REFERENCES airports(airport_id),
  scheduled_departure TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
  aircraft_id INTEGER REFERENCES aircrafts(aircraft_id) ON DELETE SET NULL,
  flight_status VARCHAR(50) NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  price_business_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.50,
  price_first_class_multiplier NUMERIC(4,2) NOT NULL DEFAULT 2.50
);

-- Таблица бронирований
CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  booking_reference VARCHAR(8) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  cashier_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  flight_id INTEGER NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
  total_cost NUMERIC(12,2) NOT NULL,
  booking_status VARCHAR(50) NOT NULL CHECK (booking_status IN ('confirmed', 'cancelled', 'cancellation_requested')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица билетов
CREATE TABLE tickets (
  ticket_id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
  passenger_full_name VARCHAR(255) NOT NULL,
  passenger_document_number VARCHAR(50) NOT NULL,
  seat_number VARCHAR(4),
  service_class VARCHAR(50) NOT NULL,
  final_price NUMERIC(10,2) NOT NULL
);