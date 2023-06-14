import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Products.module.css';
import styles2 from '../styles/Product.module.css';
import Product from './Product';
import AddForm from './AddForm';
import { getCurrentUser } from '../modules/user.js';


//
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

  const removeProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      console.error('Error removing product:', err);
      setError(err);
    }
  };


  const updateProductQuantity = async (productId, changeInQuantity) => {
    try {
      
      const res = await axios.patch(`/api/products/${productId}`, { product_quantity: changeInQuantity });

      // Update products in state
      setProducts(products.map((product) => {
        if (product._id === productId) {
          // console.log(res.data);
          product.product_quantity = res.data.product_quantity;
          return product;
        }
        return product;
      }));
    } catch (err) {
      console.error('Error updating product quantity:', err);
      setError(err);
    
      
    }
  };

  const addToCart = async (productId, changeInQuantity) => {
    try {
      await updateProductQuantity(productId, changeInQuantity);
      const user = await getCurrentUser();
      // console.log(user._id,productId,changeInQuantity);
      const response = await axios.post(`api/users/buy/${user._id}`, { product_id: productId,product_quantity: changeInQuantity,user_id: user._id });
      console.log(response);
    } catch (err) {
      console.error('Error buying product:', err);
      setError(err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className={styles['loading']}>...</div>;
    }
    if (error) {
      return <div className={styles['loading']}>An error occurred while fetching products. Please try again.</div>;
    }
    return products.map((product) => (
      <Product key={product._id} product={product} onRemove={removeProduct} onBuy={addToCart} />
    ));
  };

  const AddProduct = (newProduct)=>{
    setProducts([...products, newProduct]);
  }

const sortPrice = async (strategy) => {
    console.log(strategy);
    const response = await axios.get('/api/products/sort', { params: strategy });
    console.log(response.data);
    setProducts(response.data);
    
  };



  return (
    <div className={styles['product']}>
      <h1>Products</h1>
      <AddForm AddProduct={AddProduct}/>
      <div className={styles['product-header']}>
      <button className={styles2['button']}  onClick={() =>sortPrice({product_price:1})}>Low Price</button>
      <button className={styles2['button']}  onClick={() =>sortPrice({product_price:-1})}>High Price</button>
      <button className={styles2['button']}  onClick={() =>matchProducts({product_quantity:{$gt:0}},setProducts)}>Available</button>
      </div>
      <div className={styles['products-container']}>{renderContent()}</div>
    </div>
  );
};

const matchProducts = async (strategy,setProducts) => {
  console.log(strategy);
  const response = await axios.get('/api/products/match', {  params: {
    strategy: JSON.stringify(strategy)
  }});
  console.log(response.data);
  setProducts(response.data);
  
};

export default Products;
export { matchProducts };

