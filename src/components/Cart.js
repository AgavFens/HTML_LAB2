import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../components/styles/Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([]); // Renamed from item to items
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { handleSubmit, setValue } = useForm();

  useEffect(() => {
    fetch('http://localhost:3001/item')
      .then(response => response.json())
      .then(data => {
        const cartProducts = data.filter(item => getCart().includes(item.id));
        setItems(cartProducts);
      })
      .catch(error => console.error('Error fetching products:', error));

    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const removeFromCart = (id) => {
    let updatedCart = cart.filter(itemId => itemId !== id); // Changed item to itemId
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setItems(updatedCart.map(cartId => items.find(item => item.id === cartId))); // Changed item to items
  };

  const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  };

  const updateTotal = () => {
    return cart.reduce((sum, id) => {
      let item = items.find(p => p.id === id); // Changed item to items
      return sum + (item ? Number(item.price) : 0);
    }, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert('Ваша корзина пуста!');
      return;
    } else {
      navigate('/order');
    }
  };

  const goToProductInfo = (id) => {
    navigate(`/productinfo/${id}`); // Corrected string interpolation
  };

  return (
    <div>
      <h1>Корзина товаров</h1>
      <div className="products-container">
        {items.length === 0 ? (
          <p>Корзина пуста.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="product-card">
              <img src={item.img} alt={item.title} />
              <h3 onClick={() => goToProductInfo(item.id)}>{item.title}</h3>
              <p>Цена: {item.price} рублей</p>
              <button className="remove-from-cart-button" onClick={() => removeFromCart(item.id)}>Убрать из корзины</button>
            </div>
          ))
        )}
      </div>
      <div className="total-price">
        Общая сумма: {updateTotal()} рублей
      </div>
      <button className="place-order" onClick={placeOrder}>Совершить заказ</button>
    </div>
  );
};

export default Cart;
