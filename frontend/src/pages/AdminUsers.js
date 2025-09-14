import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone_number: '', user_role: 'user', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    }
  };
  
  const handleOpenModal = (user = null) => {
    setCurrentUser(user);
    setFormData(user ? { ...user, password: '' } : { full_name: '', email: '', phone_number: '', user_role: 'user', password: '' });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    
    if (currentUser && !dataToSend.password) {
        delete dataToSend.password; // Не отправляем пустой пароль при редактировании
    }

    try {
      if (currentUser) {
        await api.put(`/api/users/${currentUser.user_id}`, dataToSend);
      } else {
        await api.post('/api/auth/register', dataToSend);
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка сохранения пользователя:", error.response?.data);
      alert('Ошибка сохранения.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await api.delete(`/api/users/${id}`);
        setUsers(users.filter(u => u.user_id !== id));
      } catch (error) {
        console.error("Ошибка удаления:", error);
        alert('Ошибка удаления.');
      }
    }
  };

  return (
    <AdminLayout pageTitle="Управление пользователями">
      <div className="flex justify-end mb-4">
        <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800">
            Добавить пользователя
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-sm font-semibold text-left">ФИО</th>
              <th className="p-3 text-sm font-semibold text-left">Email / Телефон</th>
              <th className="p-3 text-sm font-semibold text-left">Роль</th>
              <th className="p-3 text-sm font-semibold text-left">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.user_id}>
                <td className="p-3 text-sm font-medium">{u.full_name}</td>
                <td className="p-3 text-sm">
                    <p>{u.email}</p>
                    <p className="text-gray-500">{u.phone_number}</p>
                </td>
                <td className="p-3 text-sm">{u.user_role}</td>
                <td className="p-3 text-sm space-x-2">
                  <button onClick={() => handleOpenModal(u)} className="text-gray-600 hover:underline">Ред.</button>
                  <button onClick={() => handleDelete(u.user_id)} className="text-red-600 hover:underline">Удал.</button>
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
              <h3 className="text-lg font-medium">{currentUser ? 'Редактировать' : 'Добавить'} пользователя</h3>
              <form onSubmit={handleSave} className="space-y-4 mt-4">
                <input name="full_name" value={formData.full_name} onChange={handleFormChange} placeholder="ФИО" className="w-full border rounded p-2" required />
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" className="w-full border rounded p-2" required />
                <input name="phone_number" value={formData.phone_number} onChange={handleFormChange} placeholder="Телефон" className="w-full border rounded p-2" required />
                <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder={currentUser ? "Новый пароль (оставьте пустым, чтобы не менять)" : "Пароль (мин. 6 символов)"} className="w-full border rounded p-2" required={!currentUser} />
                <select name="user_role" value={formData.user_role} onChange={handleFormChange} className="w-full border rounded p-2">
                    <option value="user">Пользователь</option>
                    <option value="cashier">Кассир</option>
                    <option value="admin">Администратор</option>
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

export default AdminUsers;