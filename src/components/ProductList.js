import React, { useEffect, useState } from 'react';
import '../components/styles/ProductList.css';

const ProductList = () => {
  const [item, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/item')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="products-container">
      {item.map(item => (
        <div key={item.id} className="product-card">
          <img src={item.img} alt={item.title} />
          <h3>{item.title}</h3>
          <p>Цена: {item.price} рублей</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
