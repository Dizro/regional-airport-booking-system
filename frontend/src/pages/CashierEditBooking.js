import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import CashierLayout from '../components/CashierLayout';
import bookingService from '../services/bookingService';
import flightService from '../services/flightService';
import SeatSelector from '../components/SeatSelector';

const CashierEditBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [flightBookedSeats, setFlightBookedSeats] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const calculatePrice = useCallback((serviceClass, flight) => {
        if (!flight) return 0;
        const basePrice = parseFloat(flight.base_price);
        switch (serviceClass) {
            case 'Бизнес': return basePrice * parseFloat(flight.price_business_multiplier);
            case 'Первый класс': return basePrice * parseFloat(flight.price_first_class_multiplier);
            default: return basePrice;
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingRes = await bookingService.getBookingById(id);
                const flightId = bookingRes.data.Flight.flight_id;
                const seatsRes = await flightService.getBookedSeats(flightId);
                
                setBooking(bookingRes.data);
                setPassengers(bookingRes.data.Tickets);
                setFlightBookedSeats(seatsRes.data.filter(seat => !bookingRes.data.Tickets.map(t => t.seat_number).includes(seat)));
            } catch (error) {
                alert('Не удалось загрузить данные бронирования.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handlePassengerChange = (index, event) => {
        const { name, value } = event.target;
        const values = [...passengers];
        values[index][name] = value;
        if (name === 'service_class') {
            values[index].final_price = calculatePrice(value, booking.Flight);
        }
        setPassengers(values);
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

    const calculateTotal = useCallback(() => {
        return passengers.reduce((total, p) => total + parseFloat(p.final_price || 0), 0);
    }, [passengers]);

    const handleUpdateBooking = async () => {
        if (passengers.some(p => !p.passenger_full_name || !p.passenger_document_number)) {
            return alert('Необходимо заполнить ФИО и номер документа для всех пассажиров.');
        }

        setIsLoading(true);
        try {
            const bookingData = {
                flight_id: booking.flight_id,
                total_cost: calculateTotal(),
                tickets: passengers,
                user_id: booking.user_id,
            };
            await bookingService.updateBooking(id, bookingData);
            alert('Бронирование успешно обновлено!');
            navigate('/cashier');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Проверьте данные.';
            alert(`Не удалось обновить бронирование.\n${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <CashierLayout pageTitle="Загрузка..."><p>Загрузка данных...</p></CashierLayout>;
    if (!booking) return <CashierLayout pageTitle="Ошибка"><p>Бронирование не найдено.</p></CashierLayout>;

    return (
        <CashierLayout pageTitle={`Редактирование брони #${booking.booking_reference}`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-bold mb-4 border-b pb-2">Пассажиры и места</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                           {passengers.map((passenger, index) => (
                               <div key={passenger.ticket_id || index} className={`p-3 border rounded-md cursor-pointer ${activePassengerIndex === index ? 'border-gray-700 border-2' : ''}`} onClick={() => setActivePassengerIndex(index)}>
                                   <p className="text-sm font-bold mb-2">Пассажир {index + 1}</p>
                                   <input name="passenger_full_name" value={passenger.passenger_full_name} onChange={e => handlePassengerChange(index, e)} className="mt-1 w-full p-1.5 text-sm" />
                                   <input name="passenger_document_number" value={passenger.passenger_document_number} onChange={e => handlePassengerChange(index, e)} className="mt-1 w-full p-1.5 text-sm" />
                                   <select name="service_class" value={passenger.service_class} onChange={e => handlePassengerChange(index, e)} className="mt-1 w-full p-1.5 text-sm">
                                       <option>Эконом</option>
                                       <option>Бизнес</option>
                                       <option>Первый класс</option>
                                   </select>
                                   <p className="mt-2 text-xs">Место: <span className="font-bold">{passenger.seat_number || "Не выбрано"}</span> / Цена: <span className="font-bold">{parseFloat(passenger.final_price).toFixed(2)} ₽</span></p>
                               </div>
                           ))}
                       </div>
                       <div>
                           <SeatSelector
                               aircraft={booking.Flight.Aircraft}
                               onSeatSelect={handleSeatSelect}
                               selectedSeat={passengers[activePassengerIndex]?.seat_number}
                               currentBookingSeats={passengers.map(p => p.seat_number)}
                               flightBookedSeats={flightBookedSeats}
                           />
                       </div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="text-right">
                        <p className="text-2xl font-bold">Итого: {calculateTotal().toFixed(2)} ₽</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <Link to="/cashier" className="px-6 py-2 bg-gray-200 rounded-lg">Отмена</Link>
                            <button onClick={handleUpdateBooking} disabled={isLoading} className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:bg-gray-400">
                                {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CashierLayout>
    );
};

export default CashierEditBooking;