import React from 'react';
import Navbar from '../components/Navbar';
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
