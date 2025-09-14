import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bookingService from '../services/bookingService';
import UserLayout from '../components/UserLayout';

const UserBookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getBookingById(id)
      .then(res => setBooking(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <UserLayout pageTitle="Загрузка..."><p>Загрузка деталей бронирования...</p></UserLayout>;
  if (!booking) return <UserLayout pageTitle="Ошибка"><p>Бронирование не найдено.</p></UserLayout>;

  return (
    <UserLayout pageTitle={`Детали бронирования #${booking.booking_reference}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-bold mb-4">Информация о рейсе</h2>
                {booking.Flight ? (
                <div className="space-y-3 text-gray-700">
                    <p><strong>Рейс:</strong> {booking.Flight.flight_number}</p>
                    <p><strong>Маршрут:</strong> {booking.Flight.departureAirport.airport_name} &rarr; {booking.Flight.arrivalAirport.airport_name}</p>
                    <p><strong>Вылет:</strong> {new Date(booking.Flight.scheduled_departure).toLocaleString('ru-RU')}</p>
                </div>
                ) : <p>Информация о рейсе недоступна.</p>}
                
                <hr className="my-6" />

                <h2 className="text-xl font-bold mb-4">Пассажиры</h2>
                <div className="space-y-4">
                {booking.Tickets.map(ticket => (
                    <div key={ticket.ticket_id} className="border rounded-lg p-4">
                    <p><strong>ФИО:</strong> {ticket.passenger_full_name}</p>
                    <p><strong>Документ:</strong> {ticket.passenger_document_number}</p>
                    <p><strong>Место:</strong> {ticket.seat_number || 'Не назначено'}</p>
                    </div>
                ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm h-fit">
                <h2 className="text-xl font-bold mb-4">Детализация</h2>
                <div className="flex justify-between font-bold text-lg">
                    <span>Итого:</span>
                    <span>{booking.total_cost} ₽</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Статус: <span className="font-semibold text-gray-800">{booking.booking_status}</span></p>
            </div>
        </div>
    </UserLayout>
  );
};

export default UserBookingDetails;