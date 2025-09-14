import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import UserLayout from '../components/UserLayout';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    bookingService.getBookings()
      .then(res => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelRequest = async (id) => {
    if (window.confirm('Вы уверены, что хотите отправить запрос на отмену этого бронирования?')) {
      try {
        await bookingService.requestCancelBooking(id);
        alert('Запрос на отмену успешно отправлен.');
        fetchBookings();
      } catch (error) {
        alert('Не удалось отправить запрос.');
      }
    }
  };

  return (
    <UserLayout pageTitle="Мои бронирования">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? <p className="p-6">Загрузка бронирований...</p> : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-brand-gray uppercase">Код брони</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-brand-gray uppercase">Маршрут</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-brand-gray uppercase">Дата вылета</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-brand-gray uppercase">Сумма</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-brand-gray uppercase">Статус</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length > 0 ? bookings.map(b => (
              <tr key={b.booking_id}>
                <td className="px-6 py-4 font-medium text-brand-dark">{b.booking_reference}</td>
                <td className="px-6 py-4 text-brand-dark">{b.Flight?.departureAirport?.airport_code} &rarr; {b.Flight?.arrivalAirport?.airport_code}</td>
                <td className="px-6 py-4 text-brand-dark">{new Date(b.Flight?.scheduled_departure).toLocaleDateString('ru-RU')}</td>
                <td className="px-6 py-4 text-brand-dark">{b.total_cost} ₽</td>
                <td className="px-6 py-4">{b.booking_status}</td>
                <td className="px-6 py-4 text-sm space-x-4 text-right">
                  <Link to={`/booking/${b.booking_id}`} className="text-brand-blue hover:underline">Подробнее</Link>
                  {b.booking_status === 'confirmed' && 
                    <button onClick={() => handleCancelRequest(b.booking_id)} className="text-red-600 hover:underline">Запросить отмену</button>
                  }
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center py-8 text-brand-gray">У вас пока нет бронирований.</td></tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </UserLayout>
  );
};

export default UserDashboard;