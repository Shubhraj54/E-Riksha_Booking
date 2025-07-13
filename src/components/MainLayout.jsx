import React from 'react';
import Navbar from './Navbar';
import NotificationCenter from './NotificationCenter';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <NotificationCenter />
  </>
);

export default MainLayout;
