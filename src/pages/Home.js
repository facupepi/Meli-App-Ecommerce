import React, { useState } from 'react';
//import './Home.css';

function Home() {
  const [listOfProducts, setListOfProducts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  function onSubmitSearch(e) {
    e.preventDefault();
    const formData_Item = new FormData(e.target);
    let query = formData_Item.get('search');

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
    <div>
      <form onSubmit={onSubmitSearch}>
        <input name="search" id="search" placeholder="Buscar productos..." />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p>{error.message}</p>}

      {listOfProducts && (
        <div>
          {listOfProducts.map((product) => (
            <div key={product.id}>
              <h3>{product.title}</h3>
              <p>Precio: ${product.price}</p>
              <img src={product.thumbnail} alt={product.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
