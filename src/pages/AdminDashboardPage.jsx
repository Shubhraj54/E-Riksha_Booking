import React, { useState, useEffect } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../CSS/AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    try {
      // Check if user is logged in
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!currentUser) {
        toast.error('Please login to access admin dashboard');
        navigate('/login');
        return;
      }

      // Check if user has admin role
      // For demo purposes, we'll check if the user email contains 'admin'
      // In a real application, you would check against a proper role system
      const hasAdminAccess = currentUser.email?.toLowerCase().includes('admin') || 
                           currentUser.role === 'admin' ||
                           currentUser.isAdmin === true;

      if (!hasAdminAccess) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast.error('Error checking access permissions');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="loading-spinner"></div>
        <p>Checking admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="admin-dashboard-page">
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage; 