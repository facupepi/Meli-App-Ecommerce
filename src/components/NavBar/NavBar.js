import {React, useState } from 'react';
import {Link , useNavigate} from 'react-router-dom';
import './NavBar.css';
import {FaShoppingCart } from 'react-icons/fa'; // Icono del carrito

const linkLogo = "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__large_plus@2x.png";

const NavBar = ({ onSubmitSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Hook para redirigir a una ruta

  function handleSearch(e) {
    e.preventDefault();
    onSubmitSearch(searchQuery);
    navigate(`/search/${searchQuery}`);  // Redirige al usuario a la página principal (/) cada vez que se realice una búsqueda desde el NavBar. Esto forzará una actualización de la lista de productos.
  }

  function handleClickLogo() {
    onSubmitSearch('');
    setSearchQuery('');
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link onClick={handleClickLogo} to="/">
          <img
            src= {linkLogo}
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
          <FaShoppingCart/>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
