import React from 'react';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Book from './pages/Booking';
import Riksha from './pages/Riksha';
import Profile from './pages/Profile';
import MainLayout from './components/MainLayout';
import BookForm from './pages/BookForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

// App.jsx
export default App;
