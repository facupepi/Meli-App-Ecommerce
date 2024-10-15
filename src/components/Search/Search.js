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
            <div className="container">
                <p>Cargando...</p>
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
                            <p className="product-price">${product.price}</p>
                            <p className="product-store">Por {product.seller?.nickname}</p>
                            <Link to={`/product/${product.id}`} className="btn-detail">Ver Detalle</Link>
                            <button className="btn-add-cart">Agregar al Carrito</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
