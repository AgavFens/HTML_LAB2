import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './styles/Catalog.css';

const Catalog = () => {
  const [item, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      search: '',
      category: 'all',
      meatType: 'all',
    },
  });
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/item')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data); // Initial display of all products
      })
      .catch(error => console.error('Error fetching products:', error));

    setCart(JSON.parse(localStorage.getItem('cart')) || []);
    setFavorites(JSON.parse(localStorage.getItem('favorites')) || []);
  }, []);

  const toggleCart = (id) => {
    let updatedCart = cart.includes(id) ? cart.filter(item => item !== id) : [...cart, id];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const toggleFavorite = (id) => {
    let updatedFavorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const goToProductInfo = (id) => {
    navigate(`/productinfo/${id}`);
  };

  const onSubmit = (data) => {
    let filtered = item.filter(item => item.title.toLowerCase().includes((data.search || '').toLowerCase()));

    // Filter by price type
    if (data.meatType && data.meatType !== 'all') {
      filtered = filtered.filter(item => item.price.toLowerCase().includes(data.meatType.toLowerCase()));
    }

    // Filter by category
    if (data.category && data.category !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase() === data.category.toLowerCase());
    }

    setFilteredProducts(filtered);
  };

  return (
    <div>
      <h1>Каталог товаров</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="search"
          control={control}
          render={({ field }) => <input type="text" placeholder="Поиск по названию" {...field} />}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select {...field}>
              <option value="all">Все категории</option>
              <option value="Soki">Соки</option>
              <option value="Nakleyka">Наклейки</option>
              <option value="Igrushki">Игрушки</option>
              <option value="Semena">Семена</option>
              <option value="Krem">Крема</option>
            </select>
          )}
        />
        <button type="submit">Применить фильтры</button>
      </form>

      <div className="products-container">
        {filteredProducts.map(item => (
          <motion.div
            key={item.id}
            className="product-card"
            whileHover={{ scale: 1.05, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={item.img} alt={item.title} />
            <h3 onClick={() => goToProductInfo(item.id)}>{item.title}</h3>
            <p>Цена: {item.price} рублей</p>
            <div className="action-buttons">
              <button className={`action-button addToCart ${cart.includes(item.id) ? 'active' : ''}`} onClick={() => toggleCart(item.id)}>
                {cart.includes(item.id) ? 'Убрать из корзины' : 'Добавить в корзину'}
              </button>
              <button className={`action-button addToFavorites ${favorites.includes(item.id) ? 'active' : ''}`} onClick={() => toggleFavorite(item.id)}>
                {favorites.includes(item.id) ? 'Убрать из избранного' : 'Добавить в избранное'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
