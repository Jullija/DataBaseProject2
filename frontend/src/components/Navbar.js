import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import {getCurrentUser, logOutUser} from "../modules/user";

const Navbar = () => {
  return (

    <div className={styles.nav}>
        <button onClick={getCurrentUser} >
            get curr user - test for now
        </button>
        <button onClick={logOutUser}>Log Out</button>
      <input type="checkbox" id={styles['nav-check']} />
      <div className={styles['nav-header']}>
        <div className={styles['nav-title']}>Bit Shop</div>
      </div>
      <div className={styles['nav-btn']}>
        <label htmlFor={styles['nav-check']}>
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
      <div className={styles['nav-links']}>
        <Link to="/">Home</Link>
        <Link to="/about">About us</Link>
        <Link to="/products">Products</Link>
        <Link to="/login">Login</Link>
        <Link to="/other">Other</Link>
        <Link to="/cart">Cart</Link>
        {/* Add more links as needed */}
      </div>
    </div>
  );
};

export default Navbar;
