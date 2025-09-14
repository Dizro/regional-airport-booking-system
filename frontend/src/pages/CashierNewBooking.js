import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CashierLayout from '../components/CashierLayout';
import flightService from '../services/flightService';
import bookingService from '../services/bookingService';
import userService from '../services/userService';
import authService from '../services/authService';
import SeatSelector from '../components/SeatSelector';
import FlightTable from '../components/FlightTable';

const ClientTypeSelection = ({ clientType, setClientType, onReset }) => (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Шаг 2: Информация о покупателе</h3>
        <div className="flex space-x-4">
            <button onClick={() => { setClientType('existing'); onReset(); }} className={`px-4 py-2 rounded-md flex-1 transition-colors ${clientType === 'existing' ? 'bg-brand-dark text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Существующий клиент</button>
            <button onClick={() => { setClientType('new'); onReset(); }} className={`px-4 py-2 rounded-md flex-1 transition-colors ${clientType === 'new' ? 'bg-brand-dark text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Новый клиент</button>
            <button onClick={() => { setClientType('anonymous'); onReset(); }} className={`px-4 py-2 rounded-md flex-1 transition-colors ${clientType === 'anonymous' ? 'bg-brand-dark text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Без аккаунта</button>
        </div>
    </div>
);

const CashierNewBooking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [flightBookedSeats, setFlightBookedSeats] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    const [clientType, setClientType] = useState('existing');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUserData, setNewUserData] = useState({ full_name: '', email: '', phone_number: '', password: '' });

    useEffect(() => {
        setIsLoading(true);
        flightService.getAllFlights()
            .then(res => setFlights(res.data))
            .catch(err => console.error("Ошибка загрузки рейсов:", err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (searchQuery.length < 3) {
            setSearchResults([]);
            return;
        }
        const handler = setTimeout(() => {
            userService.searchUsers(searchQuery)
               .then(res => setSearchResults(res.data))
               .catch(err => console.error("Ошибка поиска пользователя:", err));
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const calculatePrice = useCallback((serviceClass) => {
        if (!selectedFlight) return 0;
        const basePrice = parseFloat(selectedFlight.base_price);
        switch (serviceClass) {
            case 'Бизнес':
                return basePrice * parseFloat(selectedFlight.price_business_multiplier);
            case 'Первый класс':
                return basePrice * parseFloat(selectedFlight.price_first_class_multiplier);
            default:
                return basePrice;
        }
    }, [selectedFlight]);
    
    const handlePassengerChange = (index, event) => {
        const { name, value } = event.target;
        const values = [...passengers];
        values[index][name] = value;
        if (name === 'service_class') {
            values[index].final_price = calculatePrice(value);
        }
        setPassengers(values);
    };

    const handleSelectFlight = async (flight) => {
        setSelectedFlight(flight);
        try {
            const res = await flightService.getBookedSeats(flight.flight_id);
            setFlightBookedSeats(res.data);
        } catch (error) {
            setFlightBookedSeats([]);
        }
        const initialPrice = calculatePrice('Эконом');
        setPassengers([{ passenger_full_name: '', passenger_document_number: '', seat_number: '', service_class: 'Эконом', final_price: initialPrice }]);
        setActivePassengerIndex(0);
        setStep(2);
    };
    
    const addPassenger = () => {
        const initialPrice = calculatePrice('Эконом');
        setPassengers([...passengers, { passenger_full_name: '', passenger_document_number: '', seat_number: '', service_class: 'Эконом', final_price: initialPrice }]);
        setActivePassengerIndex(passengers.length);
    };

    const handleSubmitBooking = async () => {
        if (!selectedFlight || passengers.some(p => !p.passenger_full_name || !p.passenger_document_number)) {
            return alert('Пожалуйста, заполните все необходимые поля.');
        }

        setIsLoading(true);
        let userId = null;

        try {
            if (clientType === 'existing' && selectedUser) {
                userId = selectedUser.user_id;
            } else if (clientType === 'new') {
                const registerRes = await authService.register(newUserData);
                userId = registerRes.data.userId;
            }
        
            const bookingData = { flight_id: selectedFlight.flight_id, total_cost: calculateTotal(), tickets: passengers, user_id: userId };
            
            await bookingService.createBooking(bookingData);
            alert('Бронирование успешно создано!');
            navigate('/cashier');
        } catch (error) {
            alert(`Ошибка: ${error.response?.data?.error || 'Проверьте данные.'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetClientState = () => {
        setSelectedUser(null);
        setSearchQuery('');
        setSearchResults([]);
        setNewUserData({ full_name: '', email: '', phone_number: '', password: '' });
    };
    const handleNewUserChange = (event) => {
        setNewUserData({ ...newUserData, [event.target.name]: event.target.value });
    };
    const handleSeatSelect = (seatNumber) => {
        const currentSeat = passengers[activePassengerIndex].seat_number;
        const isSeatTakenByOther = passengers.some((p, i) => i !== activePassengerIndex && p.seat_number === seatNumber);

        if(isSeatTakenByOther || flightBookedSeats.includes(seatNumber)) {
            alert('Это место уже занято.');
            return;
        }

        const values = [...passengers];
        values[activePassengerIndex].seat_number = currentSeat === seatNumber ? '' : seatNumber;
        setPassengers(values);
    };
    const removePassenger = (index) => {
        const values = [...passengers];
        values.splice(index, 1);
        setPassengers(values);
        setActivePassengerIndex(0);
    };
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchQuery(user.full_name);
        setSearchResults([]);
        const updatedPassengers = [...passengers];
        if (!updatedPassengers[0].passenger_full_name) {
             updatedPassengers[0].passenger_full_name = user.full_name;
        }
        setPassengers(updatedPassengers);
    };
    const calculateTotal = useCallback(() => {
        return passengers.reduce((total, p) => total + parseFloat(p.final_price || 0), 0);
    }, [passengers]);

    return (
        <CashierLayout pageTitle="Мастер создания бронирования">
            <div className="max-w-7xl mx-auto space-y-6">
                {step === 1 && (
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Шаг 1: Выбор рейса</h3>
                        {isLoading ? <p>Загрузка рейсов...</p> : (
                            <FlightTable flights={flights} onSelect={handleSelectFlight} />
                        )}
                    </div>
                )}
                {step === 2 && selectedFlight && (
                    <>
                        <div className="bg-white p-6 rounded-lg border shadow-sm">
                            <p className="text-gray-800">Выбран рейс: <strong className="font-semibold">{selectedFlight.flight_number}</strong></p>
                            <button onClick={() => setStep(1)} className="text-sm text-brand-blue hover:underline mt-2">&larr; Изменить рейс</button>
                        </div>
                        <ClientTypeSelection clientType={clientType} setClientType={setClientType} onReset={resetClientState} />
                        {clientType === 'existing' && (
                            <div className="bg-white p-6 rounded-lg border shadow-sm relative">
                                <h4 className="font-semibold mb-2">Поиск клиента</h4>
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Введите ФИО, email..." className="w-full border rounded p-2" />
                                {searchResults.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {searchResults.map(user => (
                                            <li key={user.user_id} onClick={() => handleSelectUser(user)} className="p-2 hover:bg-gray-100 cursor-pointer">{user.full_name} ({user.email})</li>
                                        ))}
                                    </ul>
                                )}
                                {selectedUser && <p className="mt-2 text-sm text-green-700">✓ Выбран клиент: {selectedUser.full_name}</p>}
                            </div>
                        )}
                        {clientType === 'new' && (
                            <div className="bg-white p-6 rounded-lg border shadow-sm space-y-3">
                                <h4 className="font-semibold mb-2">Данные нового клиента</h4>
                                <input name="full_name" value={newUserData.full_name} onChange={handleNewUserChange} placeholder="ФИО" className="w-full border rounded p-2" required/>
                                <input type="email" name="email" value={newUserData.email} onChange={handleNewUserChange} placeholder="Email" className="w-full border rounded p-2" required/>
                                <input name="phone_number" value={newUserData.phone_number} onChange={handleNewUserChange} placeholder="Телефон" className="w-full border rounded p-2" required/>
                                <input type="password" name="password" value={newUserData.password} onChange={handleNewUserChange} placeholder="Пароль (мин. 6 симв.)" className="w-full border rounded p-2" required/>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-lg border shadow-sm">
                             <h3 className="text-lg font-bold mb-4 border-b pb-2">Шаг 3: Пассажиры и места</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h4 className="font-semibold">Данные пассажиров</h4>
                                    {passengers.map((passenger, index) => (
                                        <div key={index} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${activePassengerIndex === index ? 'border-brand-blue bg-brand-blue-light' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`} onClick={() => setActivePassengerIndex(index)}>
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-sm font-bold text-brand-dark">Пассажир {index + 1}</p>
                                                {index > 0 && <button onClick={(e) => {e.stopPropagation(); removePassenger(index);}} className="text-red-500 text-xs font-bold px-2">Удалить</button>}
                                            </div>
                                            <input name="passenger_full_name" value={passenger.passenger_full_name} onChange={e => handlePassengerChange(index, e)} placeholder="ФИО" className="mt-1 w-full border rounded p-1.5 text-sm" />
                                            <input name="passenger_document_number" value={passenger.passenger_document_number} onChange={e => handlePassengerChange(index, e)} placeholder="Номер документа" className="mt-1 w-full border rounded p-1.5 text-sm" />
                                            <select name="service_class" value={passenger.service_class} onChange={e => handlePassengerChange(index, e)} className="mt-1 w-full border rounded p-1.5 text-sm">
                                                <option>Эконом</option>
                                                <option>Бизнес</option>
                                                <option>Первый класс</option>
                                            </select>
                                            <p className="mt-2 text-xs text-brand-gray">Место: <span className="font-bold text-sm text-brand-dark">{passenger.seat_number || "Не выбрано"}</span> / Цена: <span className="font-bold text-sm text-brand-dark">{parseFloat(passenger.final_price).toFixed(2)} ₽</span></p>
                                        </div>
                                    ))}
                                    <button onClick={addPassenger} className="mt-2 text-sm px-3 py-1.5 bg-gray-200 rounded-lg hover:bg-gray-300">+ Пассажир</button>
                                </div>
                                <div>
                                    <SeatSelector
                                        aircraft={selectedFlight.Aircraft}
                                        onSeatSelect={handleSeatSelect}
                                        selectedSeat={passengers[activePassengerIndex]?.seat_number}
                                        currentBookingSeats={passengers.map(p => p.seat_number)}
                                        flightBookedSeats={flightBookedSeats}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border shadow-sm">
                            <h3 className="text-lg font-bold mb-4 border-b pb-2">Шаг 4: Оплата</h3>
                            <div className="text-right">
                                <p className="text-2xl font-bold">Итого: {calculateTotal().toFixed(2)} ₽</p>
                                <div className="mt-4 flex justify-end gap-4">
                                    <Link to="/cashier" className="px-6 py-2 bg-gray-200 rounded-lg">Отмена</Link>
                                    <button onClick={handleSubmitBooking} disabled={isLoading} className="px-6 py-2 bg-brand-dark text-white rounded-lg disabled:bg-gray-400">
                                        {isLoading ? 'Обработка...' : 'Подтвердить'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </CashierLayout>
    );
};

export default CashierNewBooking;