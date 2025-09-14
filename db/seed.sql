INSERT INTO airports (airport_name, airport_code) VALUES 
('Томск (Богашёво)', 'TOF'),
('Красноярск (Емельяново)', 'KJA'),
('Новосибирск (Толмачёво)', 'OVB'),
('Барнаул (им. Титова)', 'BAX');

INSERT INTO users (full_name, email, phone_number, password_hash, user_role) VALUES 
('Администратор Системы', 'admin@example.com', '+79990000001', '$2b$10$DltUI8hOi3dIVCsPTEs/ce7x4QT.uGd18KMfP0nnaQbxbVTVZ6T1q', 'admin'),
('Кассир Операторович', 'cashier@example.com', '+79990000002', '$2b$10$DltUI8hOi3dIVCsPTEs/ce7x4QT.uGd18KMfP0nnaQbxbVTVZ6T1q', 'cashier'),
('Иван Иванович Иванов', 'user@example.com', '+79990000003', '$2b$10$DltUI8hOi3dIVCsPTEs/ce7x4QT.uGd18KMfP0nnaQbxbVTVZ6T1q', 'user');

INSERT INTO aircrafts (model, aircraft_type, capacity, status) VALUES 
('Ан-24', 'Самолет', 48, 'active'),
('Ми-8', 'Вертолет', 24, 'active'),
('Airbus A320', 'Самолет', 180, 'active'),
('Sukhoi Superjet 100', 'Самолет', 98, 'active'),
('Cessna 208 Caravan', 'Самолет', 9, 'active'),
('Let L-410 Turbolet', 'Самолет', 19, 'maintenance');

INSERT INTO flights (flight_number, departure_airport_id, arrival_airport_id, scheduled_departure, scheduled_arrival, aircraft_id, flight_status, base_price, price_business_multiplier, price_first_class_multiplier) VALUES 
('SU-123', 1, 2, NOW() + interval '1 day', NOW() + interval '1 day 2 hours', 1, 'По расписанию', 8500.00, 1.5, 2.5),
('DP-567', 1, 3, NOW() + interval '2 day', NOW() + interval '2 day 1.5 hours', 2, 'По расписанию', 4500.00, 1.4, 2.0),
('UT-321', 3, 1, NOW() + interval '3 day', NOW() + interval '3 day 1.5 hours', 4, 'По расписанию', 5200.00, 1.6, 2.2);