import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import flightService from '../services/flightService';
import airportService from '../services/airportService';
import aircraftService from '../services/aircraftService';

const AdminDashboard = () => {
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFlight, setCurrentFlight] = useState(null);
    const [formData, setFormData] = useState({
        flight_number: '',
        departure_airport_id: '',
        arrival_airport_id: '',
        scheduled_departure: '',
        scheduled_arrival: '',
        aircraft_id: '',
        flight_status: 'По расписанию',
        base_price: '',
        price_business_multiplier: 1.5,
        price_first_class_multiplier: 2.5
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [flightsRes, airportsRes, aircraftsRes] = await Promise.all([
                flightService.getAllFlights(),
                airportService.getAllAirports(),
                aircraftService.getAllAircrafts()
            ]);
            setFlights(flightsRes.data);
            setAirports(airportsRes.data);
            setAircrafts(aircraftsRes.data);
        } catch (error) {
            alert("Не удалось загрузить данные.");
        }
    };

    const handleOpenModal = (flight = null) => {
        setCurrentFlight(flight);
        if (flight) {
            setFormData({
                ...flight,
                scheduled_departure: new Date(flight.scheduled_departure).toISOString().slice(0, 16),
                scheduled_arrival: new Date(flight.scheduled_arrival).toISOString().slice(0, 16),
                departure_airport_id: flight.departureAirport.airport_id,
                arrival_airport_id: flight.arrivalAirport.airport_id,
                aircraft_id: flight.Aircraft?.aircraft_id || ''
            });
        } else {
            setFormData({
                flight_number: '', departure_airport_id: '', arrival_airport_id: '',
                scheduled_departure: '', scheduled_arrival: '', aircraft_id: aircrafts[0]?.aircraft_id || '',
                flight_status: 'По расписанию', base_price: '',
                price_business_multiplier: 1.5, price_first_class_multiplier: 2.5
            });
        }
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData, aircraft_id: formData.aircraft_id || null };
            if (currentFlight) {
                await flightService.updateFlight(currentFlight.flight_id, dataToSend);
            } else {
                await flightService.createFlight(dataToSend);
            }
            handleCloseModal();
            fetchInitialData();
            alert(`Рейс успешно ${currentFlight ? 'обновлен' : 'создан'}!`);
        } catch (error) {
            alert(`Ошибка: ${error.response?.data?.errors?.join(', ') || 'Проверьте данные'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот рейс?')) {
            try {
                await flightService.deleteFlight(id);
                setFlights(flights.filter(f => f.flight_id !== id));
                alert('Рейс успешно удален.');
            } catch (error) {
                alert('Ошибка при удалении рейса.');
            }
        }
    };

    const formatDateTime = (isoString) => isoString ? new Date(isoString).toLocaleString('ru-RU') : 'N/A';

    return (
        <AdminLayout pageTitle="Управление рейсами">
            <div className="flex justify-end mb-4">
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg">
                    Добавить рейс
                </button>
            </div>
            <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-left">Рейс</th>
                            <th className="p-3 text-sm font-semibold text-left">Маршрут</th>
                            <th className="p-3 text-sm font-semibold text-left">Вылет</th>
                            <th className="p-3 text-sm font-semibold text-left">Статус</th>
                            <th className="p-3 text-sm font-semibold text-left">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {flights.map(flight => (
                            <tr key={flight.flight_id}>
                                <td className="p-3 font-medium">{flight.flight_number}</td>
                                <td className="p-3">{flight.departureAirport?.airport_code} &rarr; {flight.arrivalAirport?.airport_code}</td>
                                <td className="p-3">{formatDateTime(flight.scheduled_departure)}</td>
                                <td className="p-3">{flight.flight_status}</td>
                                <td className="p-3 space-x-2">
                                    <button onClick={() => handleOpenModal(flight)} className="text-gray-600 hover:underline">Ред.</button>
                                    <button onClick={() => handleDelete(flight.flight_id)} className="text-red-600 hover:underline">Удал.</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
                    <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={handleCloseModal}></div>
                    <div className="relative bg-white rounded-lg text-left shadow-xl w-full max-w-lg p-6">
                        <h3 className="text-lg font-medium mb-4">{currentFlight ? 'Редактировать рейс' : 'Добавить рейс'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <input name="flight_number" value={formData.flight_number} onChange={handleFormChange} placeholder="Номер рейса" className="w-full border rounded p-2" required />
                            <select name="aircraft_id" value={formData.aircraft_id} onChange={handleFormChange} className="w-full border rounded p-2" required>
                                {aircrafts.map(ac => <option key={ac.aircraft_id} value={ac.aircraft_id}>{ac.model}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <select name="departure_airport_id" value={formData.departure_airport_id} onChange={handleFormChange} className="w-full border rounded p-2" required>
                                    <option value="">Отправление</option>
                                    {airports.map(ap => <option key={ap.airport_id} value={ap.airport_id}>{ap.airport_name}</option>)}
                                </select>
                                <select name="arrival_airport_id" value={formData.arrival_airport_id} onChange={handleFormChange} className="w-full border rounded p-2" required>
                                    <option value="">Прибытие</option>
                                    {airports.map(ap => <option key={ap.airport_id} value={ap.airport_id}>{ap.airport_name}</option>)}
                                </select>
                            </div>
                            <input type="datetime-local" name="scheduled_departure" value={formData.scheduled_departure} onChange={handleFormChange} className="w-full border rounded p-2" required />
                            <input type="datetime-local" name="scheduled_arrival" value={formData.scheduled_arrival} onChange={handleFormChange} className="w-full border rounded p-2" required />
                            <input type="number" step="0.01" name="base_price" value={formData.base_price} onChange={handleFormChange} placeholder="Базовая цена" className="w-full border rounded p-2" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" step="0.01" name="price_business_multiplier" value={formData.price_business_multiplier} onChange={handleFormChange} placeholder="Множ. Бизнес" className="w-full border rounded p-2" required />
                                <input type="number" step="0.01" name="price_first_class_multiplier" value={formData.price_first_class_multiplier} onChange={handleFormChange} placeholder="Множ. Первый класс" className="w-full border rounded p-2" required />
                            </div>
                            <select name="flight_status" value={formData.flight_status} onChange={handleFormChange} className="w-full border rounded p-2" required>
                                <option>По расписанию</option>
                                <option>Задержан</option>
                                <option>Отменен</option>
                            </select>
                            <div className="mt-6 flex justify-end">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-md border mr-2">Отмена</button>
                                <button type="submit" className="px-4 py-2 rounded-md bg-gray-700 text-white">Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;