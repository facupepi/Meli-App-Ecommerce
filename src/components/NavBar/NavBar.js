import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // `Link` para navegación interna y `useNavigate` para redirecciones
import PropTypes from 'prop-types'; // PropTypes para validación de tipos en las props

import './NavBar.css'; 
import { FaShoppingCart } from 'react-icons/fa'; // Importación del icono del carrito
import { IoMdSearch } from "react-icons/io"; // Importación del icono de búsqueda

// Componente de la barra de navegación. Recibe la cantidad de productos en el carrito como prop
const NavBar = ({ cartItemsLenght }) => {
  const [searchQuery, setSearchQuery] = useState(''); // Estado local para almacenar la consulta de búsqueda
  const navigate = useNavigate(); // Hook para redirigir programáticamente a una ruta específica

  // Función que maneja el envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { // Solo se ejecuta la búsqueda si el campo de búsqueda no está vacío
      navigate(`/search/q=${searchQuery}`); // Redirige a la ruta de búsqueda con la consulta
    }
  };

  // Función que maneja el clic en el logo y redirige a la página de inicio
  const handleClickLogo = () => {
    navigate(`/`); // Redirige a la página principal
    setSearchQuery(''); // Limpia el estado de la consulta de búsqueda para resetear el campo de búsqueda
  };

  return (
    <nav className="navbar">
      {/* Logo que actúa como enlace a la página principal */}
      <div className="navbar-logo" onClick={handleClickLogo} aria-label="Ir a inicio">
        <img 
          src=".././img/MELI-logo.png" 
          alt="Mercado Libre Logo" 
          className="logo"
        />
      </div>

      {/* Barra de búsqueda */}
      <div className="navbar-search">
        <form onSubmit={handleSearch}>
          <input type="text" placeholder="Buscar productos..."  className="search-input" value={searchQuery}  onChange={(e) => setSearchQuery(e.target.value)}  aria-label="Buscar productos"/>
          <button type="submit" className="search-button" aria-label="Botón de búsqueda">
            <IoMdSearch /> {/* Icono del botón de búsqueda */}
          </button>
        </form>
      </div>

      {/* Enlace al carrito de compras */}
      <div className="navbar-cart">
        <Link to="/cart" aria-label="Ver carrito de compras">
          <FaShoppingCart /> {/* Icono del carrito */}
          {/* Si hay elementos en el carrito, muestra la cantidad */}
          {cartItemsLenght > 0 && <span>{cartItemsLenght}</span>} 
        </Link>
      </div>
    </nav>
  );
};

// Validación de tipo de prop usando PropTypes
NavBar.propTypes = {
  cartItemsLenght: PropTypes.number.isRequired, // `cartItemsLenght` debe ser un número y es requerido
};

export default NavBar;
