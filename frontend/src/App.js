import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import PublicSchedule from './pages/PublicSchedule';
import PublicFleet from './pages/PublicFleet';
import PublicContacts from './pages/PublicContacts';
import UserDashboard from './pages/UserDashboard';
import UserBookingDetails from './pages/UserBookingDetails';
import UserProfile from './pages/UserProfile';
import CashierDashboard from './pages/CashierDashboard';
import CashierNewBooking from './pages/CashierNewBooking';
import CashierEditBooking from './pages/CashierEditBooking';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminFleet from './pages/AdminFleet';
import AdminUsers from './pages/AdminUsers';

import Header from './components/Header';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Header setShowLogin={setShowLogin} setShowRegister={setShowRegister} />
        <Routes>
          {/* Public routes now standalone */}
          <Route path="/" element={<PublicSchedule />} />
          <Route path="/fleet" element={<PublicFleet />} />
          <Route path="/contacts" element={<PublicContacts />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<PrivateRoute roles={['user']}><UserDashboard /></PrivateRoute>} />
          <Route path="/booking/:id" element={<PrivateRoute roles={['user']}><UserBookingDetails /></PrivateRoute>} />
          
          {/* Shared Private Routes */}
          <Route path="/profile" element={<PrivateRoute roles={['user', 'cashier', 'admin']}><UserProfile /></PrivateRoute>} />

          {/* Cashier Routes */}
          <Route path="/cashier" element={<PrivateRoute roles={['cashier', 'admin']}><CashierDashboard /></PrivateRoute>} />
          <Route path="/cashier/new" element={<PrivateRoute roles={['cashier', 'admin']}><CashierNewBooking /></PrivateRoute>} />
          <Route path="/cashier/edit/:id" element={<PrivateRoute roles={['cashier', 'admin']}><CashierEditBooking /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/analytics" element={<PrivateRoute roles={['admin']}><AdminAnalytics /></PrivateRoute>} />
          <Route path="/admin/fleet" element={<PrivateRoute roles={['admin']}><AdminFleet /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
        </Routes>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />
        <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />
      </Router>
    </AuthProvider>
  );
}

export default App;