import React, { useEffect, useState } from "react"; // Importa React y hooks necesarios
import { useParams, Link } from 'react-router-dom'; // Importa hooks para obtener parámetros de la URL y enlaces
import './Category.css'; // Importa estilos para el componente

function Category() {
  const { id } = useParams(); // Extrae el ID de la categoría de la URL
  const [category, setCategory] = useState(null); // Estado para almacenar los datos de la categoría
  const [error, setError] = useState(null); // Estado para manejar errores
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga

  useEffect(() => {

    const request = {
      method: 'GET', // Método de solicitud HTTP
      headers: { 'Content-Type': 'application/json' } // Cabeceras de la solicitud
    };

    // Realiza la solicitud para obtener la categoría usando la API de Mercado Libre
    fetch(`https://api.mercadolibre.com/categories/${id}`, request)
      .then((response) => {
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`); // Manejo de errores si la respuesta no es OK
        return response.json(); // Convierte la respuesta a JSON
      })
      .then((data) => {
        setCategory(data); // Almacena los datos de la categoría en el estado
        setLoading(false); // Cambia el estado de carga a falso
        setError(null); // Reinicia el estado de error
      })
      .catch((error) => {
        setError(error); // Maneja cualquier error de la solicitud
        setLoading(false); // Cambia el estado de carga a falso
        setCategory(null); // Reinicia el estado de categoría
      });
  }, [id]); // Se ejecuta cuando el `id` cambia

  // Muestra un spinner mientras se carga la categoría
  if (loading) return (
    <div className="container h-100">
      <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );

  // Si hay un error, muestra un mensaje de error
  else if (error) return (
    <div className="category-container">
      <p>Error al cargar la categoria.</p>
    </div>
  );

  // Si la categoría se carga correctamente, muestra los detalles
  else
  return (
    <div className="container">
      <h2 className="title-category">{category.name}</h2> {/* Título de la categoría */}
        <div className="category-list">
          {category.children_categories.length === 0 
            ? <p>No se han encontrado categorías hijas relacionadas.</p> // Mensaje si no hay categorías hijas
            : (
              // Mapea las categorías hijas y las muestra
              category.children_categories.map((childCategory) => (
                <div className="card" key={childCategory.id}>
                  <h3>{childCategory.name}</h3> {/* Nombre de la categoría hija */}
                  <Link to={`/search/category=${childCategory.id}`} className="card-link">Ver productos</Link> {/* Enlace para ver productos de la categoría hija */}
                </div>
              ))
            )
          }
        </div>
    </div>
  );
}

export default Category; // Exporta el componente para su uso en otras partes de la aplicación
