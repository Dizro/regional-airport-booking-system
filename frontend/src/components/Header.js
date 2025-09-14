import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ setShowLogin, setShowRegister }) => {
  const { user } = useAuth();

  const getNavLinkClass = ({ isActive }) =>
    `text-brand-dark hover:text-brand-blue font-semibold transition-colors duration-200 pb-1 ${isActive ? 'border-b-2 border-brand-blue' : 'border-b-2 border-transparent'}`;

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'admin': return '/admin';
      case 'cashier': return '/cashier';
      case 'user': return '/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Логотип" className="h-8 w-8" />
          <span className="text-2xl font-bold text-brand-dark">Аэропорт региона</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={getNavLinkClass}>Расписание</NavLink>
          <NavLink to="/fleet" className={getNavLinkClass}>Парк ВС</NavLink>
          <NavLink to="/contacts" className={getNavLinkClass}>Контакты</NavLink>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <Link to={getDashboardLink()} className="px-5 py-2 rounded-lg bg-brand-dark text-white hover:bg-black text-sm font-semibold transition-colors">
              Личный кабинет
            </Link>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="px-5 py-2 rounded-lg border border-brand-light-gray bg-white hover:bg-gray-50 text-sm font-semibold transition-colors">
                Вход
              </button>
              <button onClick={() => setShowRegister(true)} className="px-5 py-2 rounded-lg bg-brand-dark text-white hover:bg-black text-sm font-semibold transition-colors">
                Регистрация
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;