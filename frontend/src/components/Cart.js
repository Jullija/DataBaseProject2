import React, { useState, useEffect } from 'react';
import { getBasketItems, getCurrentUser } from "../modules/user";
import axios from 'axios';

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
    <div>
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                Item: {item.product_name}
              </li>
            ))}
          </ul>
          <button onClick={handlePurchase}>Purchase Items</button>
        </>
      )}
    </div>
  );
};

export default Cart;
