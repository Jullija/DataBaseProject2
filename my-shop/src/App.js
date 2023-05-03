import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes as needed */}
        </Routes>
    </Router>
  );
};

export default App;