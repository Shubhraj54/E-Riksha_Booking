import React from 'react';
import VehicleManagement from '../Admin/components/VehicleManagement';
import '../CSS/VehicleManagementPage.css';

const VehicleManagementPage = () => {
  return (
    <div className="vehicle-management-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Vehicle Fleet Management</h1>
          <p>Manage your vehicle inventory, track status, and schedule maintenance</p>
        </div>
      </div>
      
      <VehicleManagement />
    </div>
  );
};

export default VehicleManagementPage; 