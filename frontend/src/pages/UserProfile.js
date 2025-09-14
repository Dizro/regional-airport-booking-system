import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import UserLayout from '../components/UserLayout';
import CashierLayout from '../components/CashierLayout';
import AdminLayout from '../components/AdminLayout';

const UserProfile = () => {
  const { user, updateUserContext } = useAuth();
  const [formData, setFormData] = useState({ full_name: '', phone_number: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
        userService.getProfile()
            .then(res => {
                setFormData({
                    full_name: res.data.full_name,
                    phone_number: res.data.phone_number,
                    email: res.data.email
                });
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await userService.updateProfile({ 
          full_name: formData.full_name, 
          phone_number: formData.phone_number 
      });
      updateUserContext({ fullName: res.data.full_name });
      setMessage('Данные успешно обновлены!');
    } catch (error) {
      setMessage('Ошибка при обновлении данных.');
    }
  };

  const renderLayout = (children) => {
    switch (user?.role) {
      case 'user': return <UserLayout pageTitle="Мой профиль">{children}</UserLayout>;
      case 'cashier': return <CashierLayout pageTitle="Мой профиль">{children}</CashierLayout>;
      case 'admin': return <AdminLayout pageTitle="Мой профиль">{children}</AdminLayout>;
      default: return <div>{children}</div>;
    }
  };
  
  if (loading) return renderLayout(<p>Загрузка профиля...</p>);

  return renderLayout(
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 text-brand-dark">Редактирование личных данных</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-brand-gray">ФИО</label>
                <input 
                    type="text"
                    value={formData.full_name} 
                    onChange={e => setFormData({...formData, full_name: e.target.value})} 
                    className="mt-1 block w-full px-3 py-2 border border-brand-light-gray rounded-md"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-brand-gray">Email (нельзя изменить)</label>
                <input 
                    type="email"
                    value={formData.email}
                    disabled 
                    className="mt-1 block w-full px-3 py-2 border border-brand-light-gray rounded-md bg-gray-100"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-brand-gray">Номер телефона</label>
                <input 
                    type="text"
                    value={formData.phone_number} 
                    onChange={e => setFormData({...formData, phone_number: e.target.value})} 
                    className="mt-1 block w-full px-3 py-2 border border-brand-light-gray rounded-md"
                />
            </div>
            <div>
                <button type="submit" className="w-full px-4 py-2 bg-brand-dark text-white rounded-md hover:bg-black">
                    Сохранить изменения
                </button>
            </div>
             {message && <p className="text-center text-green-600">{message}</p>}
        </form>
    </div>
  );
};

export default UserProfile;