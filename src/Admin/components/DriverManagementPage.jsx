import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverManagement from './DriverManagement';
import '../../CSS/DriverManagement.css';

const DriverManagementPage = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and has admin privileges
    const checkAuthorization = () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isAdmin = currentUser && currentUser.role === 'admin';
        
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        if (!isAdmin) {
          navigate('/');
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking authorization:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking authorization...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="driver-management-page">
      <DriverManagement />
    </div>
  );
};

export default DriverManagementPage; 