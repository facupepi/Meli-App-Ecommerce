import React, { useEffect, useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; // `Link` para redirigir a detalles del producto y `useParams` para obtener parámetros de la URL.
import './Search.css';

function Search() {
    // Estado para almacenar la lista de productos
    const [listOfProducts, setListOfProducts] = useState(null);
    // Estado para manejar posibles errores
    const [error, setError] = useState(null);
    // Estado para controlar si los datos están cargando
    const [loading, setLoading] = useState(false);
    // Estado para manejar la paginación (inicia en la página 0)
    const [page, setPage] = useState(0); 
    // Estado para almacenar el número total de resultados de la búsqueda
    const [totalResults, setTotalResults] = useState(0); 
    // Hook `useParams` para extraer la consulta de búsqueda desde la URL
    const { query } = useParams(); 

    // `useEffect` se ejecuta cuando cambia el `query` o el valor de `page`, haciendo la petición a la API
    useEffect(() => {

        // Objeto para definir el tipo de request, en este caso una solicitud GET
        const request = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };

        setLoading(true); 
        if (query === '') {
            setListOfProducts(null); // Si no hay consulta, resetea la lista de productos
        } else {
            // Fetch a la API de Mercado Libre, usando `query` y `offset` para la paginación
            fetch(`https://api.mercadolibre.com/sites/MLA/search?${query}&offset=${50*page}`, request)
                .then((response) => {
                    // Si hay un error en la respuesta, arroja una excepción
                    if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
                    return response.json(); // Convierte la respuesta en JSON
                })
                .then((data) => {
                    // Guarda el número total de resultados en el estado
                    setTotalResults(data.paging.total);
                    // Actualiza la lista de productos con los resultados obtenidos
                    setListOfProducts(data.results);
                    setLoading(false); // Cambia el estado de carga a falso
                    setError(null); // Si no hay errores, resetea el estado de error
                })
                .catch((error) => {
                    // Maneja posibles errores y actualiza el estado de error
                    setError(error.message);
                    setLoading(false); // Termina el estado de carga aunque ocurra un error
                    setListOfProducts(null); // Resetea la lista de productos
                });
        }
    }, [query, page]); // Este efecto se ejecuta cada vez que cambian `query` o `page`

    // Si está cargando, muestra un spinner de carga
    if (loading) {
        return (
            <div className="container h-100">
                <svg viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                </svg>
            </div>
        );
    }

    // Si hay un error, muestra un mensaje con el error
    if (error) {
        return (
            <div className="container">
                <p>Ha ocurrido un error: {error}</p>
            </div>
        );
    }

    // Si no hay productos en la búsqueda, muestra un mensaje
    if (!listOfProducts) {
        return (
            <div className="container">
                <p>No se han encontrado productos.</p>
            </div>
        );
    }

    // Renderiza la lista de productos y la paginación
    return (
        <div className="container">
            <h2 className="text-center">Productos encontrados</h2>
            <div className="product-list">
                {/* Mapea los productos y los muestra en formato de lista */}
                {listOfProducts.map((product) => (
                    <div key={product.id} className="product-item">
                        <div className="product-thumbnail">
                            <img src={product.thumbnail} alt={product.title} className="product-image"/>
                        </div>
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>

                            {/* Muestra el precio o un mensaje si no está disponible */}
                            {product.price
                                ? <p className="product-price"> {product.currency_id} {product.price.toLocaleString()}</p>
                                : <p className="product-price">Consultar Precio</p>
                            }

                            {/* Muestra la condición del producto */}
                            <p className="product-condition">Condición: {product.condition === 'new' ? 'Nuevo' : 'Usado'}</p>
                            {/* Muestra si el producto tiene envío gratis */}
                            {product.shipping.free_shipping ? <p className="product-shipping">Envío gratis</p> : null}
                            {/* Muestra el nombre del vendedor */}
                            <p className="product-store">Por {product.seller?.nickname}</p>
                            
                            {/* Enlace al detalle del producto */}
                            <Link to={`/product/${product.id}`} className="btn-detail">Ver Detalle</Link>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Controles de paginación */}
            <div className="pagination">
                <button className="pagination-button" onClick={() => setPage(page - 1)} disabled={page === 0} >Anterior</button> 
                {/* Desactiva el botón si está en la primera página*/}
                <span className="pagination-page">Página {page + 1}</span>
                <button className="pagination-button" onClick={() => setPage(page + 1)} disabled={50 * (page + 1) >= totalResults} >Siguiente</button>
                {/* Desactiva el botón si no hay más productos*/}
            </div>

        </div>
    );
}

export default Search;
