import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { FaShoppingCart } from 'react-icons/fa'; // Icono del carrito
import { IoMdSearch } from "react-icons/io";
import PropTypes from 'prop-types';

const linkLogo = "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__large_plus@2x.png";

const NavBar = ({cartItemsLenght}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Hook para redirigir a una ruta
  
  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search/q=${searchQuery}`);
  }

  function handleClickLogo() {
    navigate(`/`);
    setSearchQuery('');
  }

  return (
    <div>
      <div className="navbar-desktop">
        <nav className="navbar">
          <div className="navbar-logo" onClick={handleClickLogo}>
            <img src={linkLogo} alt="Mercado Libre Logo" className="logo"/>
          </div>
          <div className="navbar-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar productos..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el estado local
              />
              <button type="submit" className="search-button">Buscar</button>
            </form>
          </div>
          <div className="navbar-cart">
            <Link to="/cart">
              <FaShoppingCart />
              {cartItemsLenght}
            </Link>
          </div>
        </nav>
      </div>
      <div className="navbar-mobile">
        <nav className="navbar">
          <div className="navbar-logo" onClick={handleClickLogo}>
            <img src=".././img/MELI-logo.png" alt="Mercado Libre Logo" className="logo-mobile"/>
          </div>
          <div className="navbar-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar productos..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el estado local
              />
              <button type="submit" className="search-button"><IoMdSearch /></button>
            </form>
          </div>
          <div className="navbar-cart">
            <Link to="/cart">
              <FaShoppingCart />
              {cartItemsLenght}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;

NavBar.propTypes = {
  cartItemsLenght: PropTypes.number.isRequired
};