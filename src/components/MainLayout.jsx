import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NotificationCenter from './NotificationCenter';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => (
  <div className="main-layout">
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
    <NotificationCenter />
  </div>
);

export default MainLayout;
