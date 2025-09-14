import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CashierLayout = ({ children, pageTitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-brand-blue-light text-brand-blue font-semibold' : 'text-gray-600 hover:bg-gray-50'}`;


  return (
    <div className="flex h-screen bg-brand-bg">
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="flex items-center justify-center h-20 border-b">
          <span className="text-xl font-bold text-brand-dark">Панель кассира</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavLink to="/cashier" end className={getNavLinkClass}>
            Рабочий стол
          </NavLink>
           <NavLink to="/profile" className={getNavLinkClass}>
            Профиль
          </NavLink>
        </nav>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex justify-between items-center px-6 h-20 bg-white border-b">
          <h1 className="text-2xl font-bold text-brand-dark">{pageTitle}</h1>
          <div className="flex items-center">
            <span className="mr-4 text-brand-dark">{user?.fullName}</span>
            <button onClick={handleLogout} className="px-4 py-2 border border-brand-light-gray rounded-lg hover:bg-gray-50 transition-colors">
              Выход
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CashierLayout;