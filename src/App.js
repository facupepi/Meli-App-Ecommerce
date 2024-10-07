import React, { useState } from 'react';
import './App.css';

function App() {

  const [listOfProducts, setListOfProducts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const request = {
    method: 'GET',
    headers: {'Content-Type' : 'application/json'}
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    const formData_Item = new FormData(e.target); // Crea un objeto FormData para obtener los datos del formulario
    let query = formData_Item.get("search"); // Obtiene el valor del campo "nameItem"

    setLoading(true);
      fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`, request)
      .then((response) => {
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`)
        else {
          setError(null);
          setLoading(false); 
          return response.json()
        }
      })
      .then((data) => setListOfProducts(data.results))
      .catch((error) => {
        setError(error);
        setLoading(false);
        setListOfProducts(null); 
      });
  }

  return (
    <div>
      <form onSubmit={onSubmitSearch}>
        <input name='search' id='search' placeholder='Buscar productos...'></input>
        <button>Buscar</button>
      </form>

      {
        listOfProducts && (
          <div>
            {listOfProducts.map((product) => (
              <div key={product.id}>
                <h3>{product.title}</h3>
                <h3>{product.price}</h3>
                <img src={product.thumbnail} alt={product.title} />
              </div>
            ))}
          </div>
        )
      }

      {error && <p>{error.message}</p>}
      {loading && <p>Cargando...</p>}

    </div>
  );
}

export default App;
