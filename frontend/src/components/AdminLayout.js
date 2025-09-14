import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = ({ children, pageTitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: "/admin/analytics", text: "Аналитика", icon: <AnalyticsIcon /> },
    { to: "/admin", text: "Управление рейсами", icon: <FlightIcon /> },
    { to: "/admin/fleet", text: "Парк ВС", icon: <FleetIcon /> },
    { to: "/admin/users", text: "Персонал", icon: <UsersIcon /> },
    { to: "/profile", text: "Профиль", icon: <ProfileIcon /> }
  ];

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-white bg-brand-blue' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`;

  return (
    <div className="flex h-screen bg-brand-bg">
      <div className="hidden md:flex flex-col w-64 bg-brand-dark text-white">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <span className="text-xl font-bold">Панель управления</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === "/admin"} className={getNavLinkClass}>
              {link.icon}
              <span className="ml-3">{link.text}</span>
            </NavLink>
          ))}
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

const AnalyticsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
const FlightIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>;
const FleetIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12V4H4v8m16 4h-4m4 0v-4m-4 4L4 12m16 4v4H4v-4"></path></svg>;
const UsersIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const ProfileIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;

export default AdminLayout;