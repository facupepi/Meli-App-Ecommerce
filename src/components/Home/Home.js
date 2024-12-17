import React, { useEffect, useState } from 'react'; // Importa React y hooks necesarios
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import './Home.css'; // Importa estilos para el componente

function Home() {
  const [categoriesHome, setCategoriesHome] = useState(null); // Estado para almacenar las categorías
  const [error, setError] = useState(null); // Estado para manejar errores
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga

  useEffect(() => {
    const request = {
      method: 'GET', // Método de solicitud HTTP
      headers: { 'Content-Type': 'application/json' } // Cabeceras de la solicitud
    };
    // Realiza la solicitud para obtener las categorías usando la API de Mercado Libre
    fetch(`https://api.mercadolibre.com/sites/MLA/categories`, request)
      .then((response) => {
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`); // Manejo de errores si la respuesta no es OK
        return response.json(); // Convierte la respuesta a JSON
      })
      .then((data) => {
        setCategoriesHome(data); // Almacena las categorías en el estado
        setLoading(false); // Cambia el estado de carga a falso
        setError(null); // Reinicia el estado de error
      })
      .catch((error) => {
        setError(error); // Maneja cualquier error de la solicitud
        setLoading(false); // Cambia el estado de carga a falso
        setCategoriesHome(null); // Reinicia el estado de categorías
      });
  }, []); // Se ejecuta una sola vez al cargar el componente

  // Muestra un spinner mientras se cargan las categorías
  if (loading) return (
    <div className="container h-100">
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );

  // Si hay un error, muestra un mensaje de error
  else if (error) return (
    <div className="home-container">
      <p>Error al cargar la categoria.</p>
    </div>
  );

  // Si las categorías se cargan correctamente, muestra los detalles
  else
  return (
    <div className="home-container">
      <div className="card-container">
        {categoriesHome.map((category) => (
          <div className="card" key={category.id}>
            <h3>{category.name}</h3> {/* Nombre de la categoría */}
            <Link to={`/category/${category.id}`} className="card-link">Ver Más</Link> {/* Enlace para ver productos de la categoría */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home; // Exporta el componente para su uso en otras partes de la aplicación
