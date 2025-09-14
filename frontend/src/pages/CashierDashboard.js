import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CashierLayout from '../components/CashierLayout';
import bookingService from '../services/bookingService';

const CashierDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchBookings = useCallback(async (searchQuery = '') => {
        setIsLoading(true);
        try {
            const params = searchQuery ? { search: searchQuery } : {};
            const res = await bookingService.getBookings(params);
            setBookings(res.data);
        } catch (error) {
            alert("Не удалось загрузить бронирования.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBookings(searchTerm);
    };
    
    const handleProcessCancellation = async (booking, action) => {
        const actionText = action === 'confirm' ? 'подтвердить отмену' : 'отклонить отмену';
        if (window.confirm(`Вы уверены, что хотите ${actionText} для брони #${booking.booking_reference}?`)) {
            try {
                await bookingService.processCancellation(booking.booking_id, action);
                alert('Статус бронирования успешно обновлен.');
                fetchBookings(searchTerm);
            } catch (error) {
                alert('Ошибка при обработке запроса.');
            }
        }
    };

    const tasks = bookings.filter(b => b.booking_status === 'cancellation_requested');
    const recentOperations = searchTerm ? bookings : bookings.slice(0, 10);

    return (
        <CashierLayout pageTitle="Рабочий стол">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Операции с бронированиями</h2>
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Поиск по коду, ФИО, № рейса..." className="flex-grow p-3 border rounded-md" />
                            <button type="submit" className="px-6 py-3 border rounded-md bg-gray-100 hover:bg-gray-200">Найти</button>
                            <Link to="/cashier/new" className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800">
                                Новое бронирование
                            </Link>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h2 className="text-xl font-bold mb-4">{searchTerm ? 'Результаты поиска' : 'Последние операции'}</h2>
                        <div className="overflow-x-auto">
                            {isLoading ? <p>Загрузка...</p> : (
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6">Бронь / Рейс</th>
                                            <th className="py-3 px-6">Пассажир(ы) и места</th>
                                            <th className="py-3 px-6">Сумма / Статус</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOperations.length > 0 ? recentOperations.map(b => (
                                            <tr key={b.booking_id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="py-4 px-6 font-medium">
                                                    <p className="text-gray-900">{b.booking_reference}</p>
                                                    <p className="text-gray-500">{b.Flight?.flight_number}</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <ul className="list-disc list-inside">
                                                        {b.Tickets.map(t => (
                                                            <li key={t.ticket_id}>{t.passenger_full_name} <strong>({t.seat_number || 'б/м'})</strong></li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="font-semibold">{b.total_cost} ₽</p>
                                                    <p className="text-xs">{b.booking_status}</p>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="text-center py-4">Ничего не найдено.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Задачи в обработке</h2>
                    {tasks.length > 0 ? (
                        <ul className="space-y-4">
                            {tasks.map(task => (
                                <li key={task.booking_id} className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
                                    <p className="font-semibold">Запрос на отмену</p>
                                    <p className="text-sm">Бронь #{task.booking_reference}</p>
                                    <div className="mt-2 space-x-2">
                                        <button onClick={() => handleProcessCancellation(task, 'confirm')} className="text-sm text-green-700 hover:underline">Подтвердить</button>
                                        <button onClick={() => handleProcessCancellation(task, 'reject')} className="text-sm text-red-700 hover:underline">Отклонить</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">Нет задач в обработке.</p>
                    )}
                </div>
            </div>
        </CashierLayout>
    );
};

export default CashierDashboard;