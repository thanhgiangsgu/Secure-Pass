import './App.css';
import Navbar from './components/Navbar';
import { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { Toaster, ToastProvider } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Warehouse from './pages/Warehouse'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Report from './pages/Report'
import Login from './pages/Login'
import Share from './pages/Share'
import Register from './pages/Register';
function App() {
  return (

      <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/warehouse" element={<Warehouse id={"warehouse"} />} />
            <Route path="/share" element={<Share id={"upcoming"} />} />
            <Route path="/tools" element={<Tools id={"tools"} />} />
            <Route path="/report" element={<Report id={"contact"} />} />
            <Route path="/login" element={<Login id={"login"} />} />
            <Route path="/register" element={<Register id={"register"} />} />
          </Routes>
          <Toaster />
      </BrowserRouter>
  );
}

export default App;
