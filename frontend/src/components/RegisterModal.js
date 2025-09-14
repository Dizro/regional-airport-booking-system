import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ full_name: '', email: '', phone_number: '', password: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      alert('Регистрация успешна! Теперь вы можете войти в систему.');
      onSwitchToLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка регистрации');
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform w-full max-w-md p-8">
        <h3 className="text-2xl font-bold text-center text-brand-dark">Регистрация</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input placeholder="ФИО" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-2 border border-brand-light-gray rounded-md focus:ring-brand-blue focus:border-brand-blue" required />
          <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-brand-light-gray rounded-md focus:ring-brand-blue focus:border-brand-blue" required />
          <input placeholder="Телефон" value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} className="w-full px-4 py-2 border border-brand-light-gray rounded-md focus:ring-brand-blue focus:border-brand-blue" required />
          <input type="password" placeholder="Пароль (мин. 6 символов)" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border border-brand-light-gray rounded-md focus:ring-brand-blue focus:border-brand-blue" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="mt-6">
            <button type="submit" className="w-full px-4 py-2 rounded-md bg-brand-dark text-white font-semibold hover:bg-black transition-colors">Зарегистрироваться</button>
          </div>
           <p className="text-center text-sm mt-4">
            Уже есть аккаунт?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-semibold text-brand-blue hover:underline">
              Войти
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;