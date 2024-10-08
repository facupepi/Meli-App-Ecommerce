import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { FaShoppingCart } from 'react-icons/fa'; // Icono del carrito

const NavBar = ({ onSubmitSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      onSubmitSearch(searchQuery);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img
            src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__large_plus@2x.png"
            alt="Mercado Libre Logo"
            className="logo"
          />
        </Link>
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
          <FaShoppingCart size={30} />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
