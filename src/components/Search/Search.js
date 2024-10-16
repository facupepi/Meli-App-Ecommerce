import React, { useEffect, useState } from 'react'; 
import { Link, useParams } from 'react-router-dom';
import './Search.css';

function Search() {
    const [listOfProducts, setListOfProducts] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { query } = useParams(); // Extrae el query de la URL

    const request = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    useEffect(() => {
        setLoading(true);
        if (query === '') {
            setListOfProducts(null);
        } else {
            fetch(`https://api.mercadolibre.com/sites/MLA/search?${query}`, request)
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
                    setError(error.message);
                    setLoading(false);
                    setListOfProducts(null);
                });
        }
    }, [query]); // Se ejecuta cada vez que el query cambie

    if (loading) {
        return (
            <div className="container h-100">
                <svg viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <p>Ha ocurrido un error: {error}</p>
            </div>
        );
    }

    if (!listOfProducts) {
        return (
            <div className="container">
                <p>No se han encontrado productos.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="text-center">Productos encontrados</h2>
            <div className="product-list">
                {listOfProducts.map((product) => (
                    <div key={product.id} className="product-item">
                        <div className="product-thumbnail">
                            <img src={product.thumbnail} alt={product.title} className="product-image"/>
                        </div>
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>

                            {product.price
                                ? <p className="product-price"> {product.currency_id} {product.price.toLocaleString()}</p>
                                : <p className="product-price">Consultar Precio</p>
                            }

                            <p className="product-condition">Condición: {product.condition === 'new' ? 'Nuevo' : 'Usado'}</p>
                            {product.shipping.free_shipping? <p className="product-shipping">Envío gratis</p> : null}
                            <p className="product-store">Por {product.seller?.nickname}</p>
                            
                            <Link to={`/product/${product.id}`} className="btn-detail">Ver Detalle</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
