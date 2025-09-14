import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const AdminFleet = () => {
  const [aircrafts, setAircrafts] = useState([]);
  // Состояния для модального окна и формы
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAircraft, setCurrentAircraft] = useState(null); // Для редактирования
  const [formData, setFormData] = useState({ model: '', aircraft_type: '', capacity: '', status: 'active' });

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const fetchAircrafts = async () => {
    try {
      const res = await api.get('/api/aircrafts');
      setAircrafts(res.data);
    } catch (error) {
      console.error("Ошибка загрузки парка ВС:", error);
    }
  };

  const handleOpenModal = (aircraft = null) => {
    setCurrentAircraft(aircraft);
    setFormData(aircraft ? { ...aircraft } : { model: '', aircraft_type: '', capacity: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAircraft(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentAircraft) {
        // Редактирование
        await api.put(`/api/aircrafts/${currentAircraft.aircraft_id}`, formData);
      } else {
        // Создание
        await api.post('/api/aircrafts', formData);
      }
      fetchAircrafts();
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert('Ошибка сохранения данных.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это ВС?')) {
      try {
        await api.delete(`/api/aircrafts/${id}`);
        setAircrafts(aircrafts.filter(a => a.aircraft_id !== id));
      } catch (error) {
        alert('Ошибка удаления');
      }
    }
  };

  return (
    <AdminLayout pageTitle="Управление парком ВС">
      <div className="flex justify-end mb-4">
        <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Добавить ВС
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-sm font-semibold text-left">Модель</th>
              <th className="p-3 text-sm font-semibold text-left">Тип</th>
              <th className="p-3 text-sm font-semibold text-left">Вместимость</th>
              <th className="p-3 text-sm font-semibold text-left">Статус</th>
              <th className="p-3 text-sm font-semibold text-left">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {aircrafts.map(a => (
              <tr key={a.aircraft_id}>
                <td className="p-3 text-sm font-medium">{a.model}</td>
                <td className="p-3 text-sm">{a.aircraft_type}</td>
                <td className="p-3 text-sm">{a.capacity}</td>
                <td className="p-3 text-sm">{a.status}</td>
                <td className="p-3 text-sm space-x-2">
                  <button onClick={() => handleOpenModal(a)} className="text-gray-600 hover:underline">Ред.</button>
                  <button onClick={() => handleDelete(a.aircraft_id)} className="text-red-600 hover:underline">Удал.</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={handleCloseModal}></div>
            <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform w-full max-w-lg p-6">
              <h3 className="text-lg font-medium">{currentAircraft ? 'Редактировать ВС' : 'Добавить ВС'}</h3>
              <form onSubmit={handleSave}>
                <input name="model" value={formData.model} onChange={handleFormChange} placeholder="Модель" className="mt-2 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md" required/>
                <input name="aircraft_type" value={formData.aircraft_type} onChange={handleFormChange} placeholder="Тип" className="mt-2 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md" required/>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleFormChange} placeholder="Вместимость" className="mt-2 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md" required/>
                <select name="status" value={formData.status} onChange={handleFormChange} className="mt-2 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md">
                    <option value="active">Активен</option>
                    <option value="maintenance">На обслуживании</option>
                    <option value="retired">Выведен из эксплуатации</option>
                </select>
                <div className="mt-4 flex justify-end">
                  <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-md border border-gray-300 mr-2">Отмена</button>
                  <button type="submit" className="px-4 py-2 rounded-md bg-gray-700 text-white">Сохранить</button>
                </div>
              </form>
            </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFleet;