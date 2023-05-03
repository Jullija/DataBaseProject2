import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Products.module.css';
import Product from './Product';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err); 
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles['products']}>
      <h1>Products</h1>
      <div className={styles['products-container']}>
        {loading ? (<div className={styles['loading']}>...</div>) 
        : error  ? (<div className={styles['loading']}>An error occurred while fetching products. Please try again.</div>) 
        : (products.map((product) => <Product key={product._id} product={product} />))
        }
      </div>
    </div>
  );
};

export default Products;
