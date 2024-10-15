import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [categoriesHome, setCategoriesHome] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const request = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  };

  useEffect(() => {
    fetch(`https://api.mercadolibre.com/sites/MLA/categories`, request).then((response) => {
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            return response.json();
        }).then((data) => {
            setCategoriesHome(data);
            setLoading(false);
            setError(null);
        }).catch((error) => {
            setError(error);
            setLoading(false);
            setCategoriesHome(null);
        });
  }, []);

  if (loading) return (
    <div className="home-container">
      <p>Cargando categorías...</p>
    </div>
  )
  else if (error) return (
    <div className="home-container">
      <p>Error al cargar la categoria.</p>;
    </div>
  )
  else
  return (
    <div className="home-container">
      <div className="card-container">
        {categoriesHome.map((category) => (
          <div className="card" key={category.id}>
            <h3>{category.name}</h3>
            <Link to={`/category/${category.id}`} className="card-link">Ver Más</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
