import React, { useEffect, useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import '../components/styles/Order.css';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [items, setItems] = useState([]); // Changed to items for clarity
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const form = useRef();

  useEffect(() => {
    fetch('http://localhost:3001/item')
      .then(response => response.json())
      .then(data => {
        const cartProducts = data.filter(item => getCart().includes(item.id));
        setItems(cartProducts);
        const totalPrice = cartProducts.reduce((sum, item) => sum + Number(item.price), 0); // Convert item.price to number
        setTotal(totalPrice);
      })
      .catch(error => console.error('Error fetching products:', error));

    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const placeOrder = (event) => {
    event.preventDefault();
    const fullname = event.target.fullname.value;
    const email = event.target.email.value;
    const address = event.target.address.value;

    if (!fullname || !email || !address) {
      alert('Пожалуйста, заполните все поля формы.');
      return;
    }

    if (!captchaValue) {
      alert('Пожалуйста, подтвердите, что вы не робот.');
      return;
    }

    setIsOrdering(true);

    const orderDetails = items.map(item => `${item.title}: ${item.price} рублей`).join('\n'); // Changed product to item
    const message = `
      ФИО: ${fullname}
      Email: ${email}
      Адрес: ${address}
      Заказ:
      ${orderDetails}
      Общая сумма: ${total} рублей
    `;

    const templateParams = {
      user_name: fullname,
      user_email: email,
      message: message
    };

    emailjs.send('service_wgxqgx2', 'template_gzwcv7t', templateParams, 'RGq-lGSU2sBkQyaIK')
      .then(
        (result) => {
          console.log('SUCCESS!', result.text);
          setIsSuccess(true);

          setIsOrdering(false);

          localStorage.removeItem('cart');

          setTimeout(() => {
            navigate('/');
          }, 2000);
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте снова.');

          setIsOrdering(false);
        },
      );
  };

  return (
    <div className="order-container">
      <h1>Оформление заказа</h1>
      <div className="order-card">
        <h2>Ваш заказ</h2>
        <div id="order-products" className="order-products">
          {items.length === 0 ? (
            <p>Корзина пуста.</p>
          ) : (
            items.map(item => ( // Changed product to item
              <div key={item.id} className="product-summary">
                <p>{item.title}</p>
                <p>Цена: {item.price} рублей</p>
              </div>
            ))
          )}
        </div>
        <div id="order-total" className="order-total">
          Общая сумма: {total} рублей
        </div>
      </div>
      <div className="order-form">
        <h2>Оформление заказа</h2>
        <form ref={form} id="order-form" onSubmit={placeOrder}>
          <div className="form-group">
            <label htmlFor="fullname">ФИО</label>
            <input type="text" id="fullname" name="fullname" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Эл. почта</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Адрес проживания</label>
            <input id="address" name="address" required />
          </div>
          <motion.button
            type="submit"
            className="place-order-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isOrdering ? 'Отправка...' : 'Заказать'}
          </motion.button>
        </form>
      </div>
      <ReCAPTCHA
        sitekey="6Ld6Z_4pAAAAAKV02nAru6Ztq-XYPBB8SD_-RaBx"
        onChange={onCaptchaChange}
      />
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="success-checkmark"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Order;
