import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка входа');
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform w-full max-w-md p-8">
        <h3 className="text-2xl font-bold text-center text-brand-dark">Вход в систему</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-brand-light-gray rounded-md focus:ring-brand-blue focus:border-brand-blue" required />
          <input type="password" placeholder="Пароль" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border border-brand-light-gray rounded-md focus:ring-brand-blue focus:border-brand-blue" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="mt-6">
            <button type="submit" className="w-full px-4 py-2 rounded-md bg-brand-dark text-white font-semibold hover:bg-black transition-colors">Войти</button>
          </div>
          <p className="text-center text-sm mt-4">
            Нет аккаунта?{' '}
            <button type="button" onClick={onSwitchToRegister} className="font-semibold text-brand-blue hover:underline">
              Зарегистрироваться
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;