import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Category() {
  const { id } = useParams(); // Extrae el ID de la URL
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const request = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  useEffect(() => {
    fetch(`https://api.mercadolibre.com/categories/${id}`, request)
      .then((response) => {
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        return response.json();
      }).then((data) => {
        setCategory(data);
        setLoading(false);
        setError(null);
      }).catch((error) => {
        setError(error);
        setLoading(false);
        setCategory(null);
      });
  }, [id]);

  return (
    loading ? (<p>Cargando...</p>)
    :
    (
      <div className="container">
        {category
          ? (
            <div className="product-list">
              <h2>{category.name}</h2>
              <h3>Categorías Hijas:</h3>
              {/* Muestra las categorías hijas */}
              {category.children_categories.length > 0 ? (
                category.children_categories.map((childCategory) => (
                  <div className="card" key={childCategory.id}>
                    <h3>{childCategory.name}</h3>
                    <p>Total de productos: {childCategory.total_items_in_this_category}</p>
                    <Link to={`/search/${childCategory.name}`} className="card-link">Ver productos</Link>
                  </div>
                ))
              ) : (
                <p>No se han encontrado categorías hijas relacionadas.</p>
              )}
            </div>
          )
          : (
            <p>Error al cargar la categoría.</p>
          )
        }
      </div>
    )
  );
}

export default Category;
