import React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';

import Home from './components/General/Home';
import ErrorPage from './components/General/ErrorPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}