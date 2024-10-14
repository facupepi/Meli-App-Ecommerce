import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetch("https://api.mercadolibre.com/sites/MLA/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="home-container">
      {/* Verifica que las categorías ya fueron cargadas */}
      {categories ? (
        <div className="card-container">
          {categories.map((category) => (
            <div className="card" key={category.id}>
              <h3>{category.name}</h3>
              <Link to={`/category/${category.id}`} className="card-link">Ver productos</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando categorías...</p>
      )}
    </div>
  );
}

export default Home;
