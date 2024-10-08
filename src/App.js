import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import NavBar from './components/NavBar';

function App() {
  const [listOfProducts, setListOfProducts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  function onSubmitSearch(query) {
    setLoading(true);
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`, request)
      .then((response) => {
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setListOfProducts(data.results);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        setListOfProducts(null);
      });
  }

  return (
    <Router>
      <NavBar onSubmitSearch={onSubmitSearch} />
      <Routes>
        <Route path="/" element={<Home products={listOfProducts} />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
