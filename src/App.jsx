import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from './contexts/NotificationContext';
import { initializeSampleData } from './utils/sampleData';
import './utils/adminSetup'; // Auto-setup admin user
import About from './pages/About';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Book from './pages/Booking';
import Riksha from './pages/Riksha';
import Profile from './pages/Profile';
import VehicleManagementPage from './pages/VehicleManagementPage';
import AdminDashboardPage from './Admin/components/AdminDashboardPage';
import DriverManagementPage from './Admin/components/DriverManagementPage';
import MainLayout from './components/MainLayout';
import BookForm from './pages/BookForm';
import NotFound from './pages/NotFound';
// Admin Panel Components
import AdminLayout from './Admin/components/AdminLayout';
import AdminLogin from './Admin/components/AdminLogin';
import AdminDashboard from './Admin/components/AdminDashboard';
import AdminUsers from './Admin/components/AdminUsers';
import AdminBookings from './Admin/components/AdminBookings';
import AdminPayments from './Admin/components/AdminPayments';
import AdminSettings from './Admin/components/AdminSettings';
// RideX Components
import RideHome from './Ride/app/page';
import './Ride/Style/common.css';

import './App.css';
function App() {
  useEffect(() => {
    // Initialize sample data for testing
    initializeSampleData();
  }, []);

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Main Site Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/book" element={<Book />} />
            <Route path="/bookForm" element={<BookForm />} />
            <Route path="/rickshaws" element={<Riksha />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vehicle-management" element={<VehicleManagementPage />} />
            <Route path="/driver-management" element={<DriverManagementPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* Admin Panel Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/driver-management" element={<DriverManagementPage />} />
            <Route path="/admin/vehicle-management" element={<VehicleManagementPage />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
          {/* RideX Panel Routes */}
          <Route path="/ride" element={<RideHome />} />

          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}


export default App;
