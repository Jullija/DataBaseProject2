import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import { logOutUser, isLoggedIn,getCurrentUser } from "../modules/user";
import React, { useState, useEffect } from 'react';


const Navbar = () => {
  const [isLoggedInStatus, setIsLoggedInStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await isLoggedIn();
      setIsLoggedInStatus(status);
      const user = await getCurrentUser(); // Przykładowe pobranie użytkownika
      setCurrentUser(user.name);
    };

    checkLoginStatus();
  }, []);



  return (
    <div className={styles.nav}>
    
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
        {isLoggedInStatus ?
            <Link to="" onClick={logOutUser}>Log Out</Link>
            :
            <Link to="/login">Login</Link>
        }
        {isLoggedInStatus && <Link to="/cart">Cart</Link>}
        <Link to="/other">Other</Link>
        {isLoggedInStatus && <Link to="/#">{currentUser}</Link>}
      </div>
    </div>
  );
};

export default Navbar;
