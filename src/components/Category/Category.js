import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import './Category.css'

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
  }, []);

  if (loading) return (
    <div className="container h-100">
      <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
      </svg>
  </div>
  )
  else if (error) return (
    <div className="category-container">
      <p>Error al cargar la categoria.</p>;
    </div>
  )
  else
  return (
    <div className="container">
      <h2 className="title-category">{category.name}</h2>
        <div className="category-list">
          {category.children_categories.length === 0 
            ? <p>No se han encontrado categorías hijas relacionadas.</p>
            : (
              category.children_categories.map((childCategory) => (
                <div className="card" key={childCategory.id}>
                  <h3>{childCategory.name}</h3>
                  <p>Total de productos: {childCategory.total_items_in_this_category}</p>
                  <Link to={`/search/category=${childCategory.id}`} className="card-link">Ver productos</Link>
                </div>
              ))
            )
          }
        </div>
    </div>
  );
}

export default Category;