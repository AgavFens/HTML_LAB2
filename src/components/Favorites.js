import React, { useEffect, useState } from 'react';
import '../components/styles/Favorites.css';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [item, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/item')
      .then(response => response.json())
      .then(data => {
        const favoriteProducts = data.filter(item => getFavorites().includes(item.id));
        setProducts(favoriteProducts);
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
    setProducts(updatedFavorites.map(favId => item.find(item => item.id === favId)));
  };

  const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  };

  const goToProductInfo = (id) => {
    navigate(`/productinfo/${id}`);
  };

  return (
    <div>
      <h1>Избранное</h1>
      <div className="products-container">
        {item.length === 0 ? (
          <p>Избранное пусто.</p>
        ) : (
          item.map(item => (
            <div key={item.id} className="product-card">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
