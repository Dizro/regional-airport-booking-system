import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
    const [salesData, setSalesData] = useState({ labels: [], datasets: [] });
    const [loadData, setLoadData] = useState({ labels: [], datasets: [] });
    const [cashierData, setCashierData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        api.get('/api/analytics/sales').then(res => {
            const labels = res.data.map(d => new Date(d.date).toLocaleDateString('ru-RU'));
            const data = res.data.map(d => d.total_sales);
            setSalesData({
                labels,
                datasets: [{ label: 'Выручка за день, ₽', data, borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)' }]
            });
        }).catch(err => console.error("Ошибка отчета по продажам:", err));

        api.get('/api/analytics/load').then(res => {
            setLoadData({
                labels: res.data.map(d => d.flight_number),
                datasets: [{ label: 'Продано билетов', data: res.data.map(d => d.booked_seats), backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
            });
        }).catch(err => console.error("Ошибка отчета по загрузке:", err));
        
        api.get('/api/analytics/cashier-activity').then(res => {
            setCashierData({
                labels: res.data.map(d => d.cashier_name),
                datasets: [{ label: 'Кол-во созданных броней', data: res.data.map(d => d.bookings_created), backgroundColor: 'rgba(255, 159, 64, 0.6)' }]
            });
        }).catch(err => console.error("Ошибка отчета по кассирам:", err));
    }, []);

    const options = { responsive: true, plugins: { legend: { position: 'top' } } };

    return (
        <AdminLayout pageTitle="Аналитика и отчеты">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Продажи за последние 7 дней</h2>
                    <Line options={options} data={salesData} />
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Загрузка последних рейсов</h2>
                    <Bar options={options} data={loadData} />
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Активность кассиров за 30 дней</h2>
                    <Bar options={options} data={cashierData} />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalytics;