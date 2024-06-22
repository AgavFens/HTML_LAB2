import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductList from './components/ProductList';
import Catalog from './components/Catalog';
import Favorites from './components/Favorites';
import Cart from './components/Cart';
import Order from './components/Order';
import ProductInfo from './components/ProductInfo';
import ContactForm from './components/ContactForm';
import './App.css';

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <div className="logo">
            <img src="/images/Логшо.jpg" alt="Логотип" />
          </div>
          <nav>
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/favorites">Избранное</Link>
            <Link to="/cart">Корзина</Link>
            <Link to="/order">Заказ</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <h1>Добро пожаловать в Магазин Лимпопо!</h1>
                <p>Мы продаем все товары от нашего лидера Лимпопо, самого мощного чела в мире</p>
                <ProductList />
              </div>
            } />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/productinfo/:id" element={<ProductInfo />} />
          </Routes>
          <ContactForm />
        </main>
        <motion.footer
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <p>Магазин Лимпопо. &copy; Все права защищены. 2024 год.</p>
        </motion.footer>
      </div>
    </Router>
  );
}

export default App;
