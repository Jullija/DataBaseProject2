import React, { useState } from 'react';
import styles from '../styles/AddForm.module.css';
import axios from 'axios';


const AddForm = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState({
      name: '',
      price: '',
      type: '',
      imageLink: '',
      description: '',
      subscribe: false,
    });
  
    const handleOpenForm = () => {
      setIsOpen(true);
    };
  
    const handleCloseForm = () => {
      setIsOpen(false);
    };
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      setFormValues({ ...formValues, [name]: newValue });
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const newProduct = {
            product_name: formValues.name,
            product_price: formValues.price,
            product_type: formValues.type,
            image_link: formValues.imageLink,
            product_description: formValues.description
          };
        const response = await axios.post('/api/products', newProduct);
        console.log(response.data);
        props.AddProduct(response.data);
        handleCloseForm();
      } catch (err) {
        console.error('Error adding product:', err);
        setError(err);
      }
    // console.log(formValues);
    };
 

    return (
      <div className={styles['form-container']}>
        <button className={styles['form-open-btn']}onClick={handleOpenForm}>
          Add Product
        </button>
        <div className={`${styles['form-overlay']} ${isOpen ? styles['open'] : ''}`} onClick={handleCloseForm}></div>
        <div className={`${styles['form-panel']} ${isOpen ? styles['open'] : ''}`}>
          <button className={styles['close-button']} onClick={handleCloseForm}>X</button>
          <h2>Add Product</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles['form-row']}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formValues.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles['form-row']}>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                value={formValues.price}
                onChange={handleChange}
              />
            </div>
            <div className={styles['form-row']}>
              <label htmlFor="type">Type</label>
              <input
                type="text"
                name="type"
                id="type"
                value={formValues.type}
                onChange={handleChange}
              />
            </div>
            <div className={styles['form-row']}>
              <label htmlFor="type">Image Link</label>
              <input
                type="text"
                name="imageLink"
                id="imageLink"
                value={formValues.imageLink}
                onChange={handleChange}
              />
            </div>
            <div className={styles['form-row']}>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                value={formValues.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className={styles['form-row']}>
              <label htmlFor="subscribe">
                <input
                  type="checkbox"
                  name="subscribe"
                  id="subscribe"
                  checked={formValues.subscribe}
                  onChange={handleChange}
                />
              </label>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  };

export default AddForm;