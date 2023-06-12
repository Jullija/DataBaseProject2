import React, { useState, useEffect } from 'react';
import { getBasketItems, getCurrentUser } from "../modules/user";
import axios from 'axios';
import styles from '../styles/Cart.module.css';

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchBasketItems = async () => {
      const basketItems = await getBasketItems();
      setItems(basketItems);
    };

    fetchBasketItems();
  }, []);

  const handlePurchase = async () => {
    try {
      const user = await getCurrentUser();
      const response = await axios.post(`api/users/purchase/${user._id}`, {
        basket: [],
        history: items
      });

      if (response.status === 200) {
        setItems([]);
        alert('Purchase successful!');
      } else {
        throw new Error('Failed to update the basket and history');
      }
      
    } catch (error) {
      console.error('Failed to purchase:', error);
      alert('Purchase failed, please try again.');
    }
  };

  return (
    <div className={styles['cart']}>
      <h1>Your Cart</h1>
      {items.length === 0 ? 
      (<p>Your cart is empty</p>) : 
      (<>
        <div className={styles['cart-container']}>
            {items.map((item, index) => (
              <div key={index} className={styles['cart-item']}>
                <p2>Name: {item.product_name} </p2>
                <p2>Price: {item.product_price} </p2>
                <p2>Type: {item.product_type} </p2>
              </div>
            ))}
        </div>
        <button className={styles['cart-button']} onClick={handlePurchase}>Purchase Items</button>
      </>
      )}
    </div>
  );
};

export default Cart;
