import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles/ProductInfo.css';

const ProductInfo = () => {
  const { id } = useParams();
  const [item, setProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/item')
      .then(response => response.json())
      .then(data => {
        const itemData = data.find(item => item.id === id);
        setProduct(itemData);
      })
      .catch(error => console.error('Error fetching item:', error));
  }, [id]);
  

  if (!item) {
    return <p>Продукт не найден</p>;
  }

  return (
    <div className="product-info-container">
      <h1>{item.title}</h1>
      <div className="product-details">
        <img src={item.img} alt={item.title} />
        <p>Категория: {item.category}</p>
        <p>Цена: {item.price} рублей</p>
        <p>Описание: {item.desc}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
