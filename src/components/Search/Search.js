import React from 'react';
import {Link} from 'react-router-dom';
import './Search.css';

function Search({products, loading}) {
    return (
        loading ? (<p>Cargando...</p>)
        :
        (
            <div className="container">
                <h2>Productos encontrados</h2>
                {products
                    ? (
                        <div className="product-list">
                            
                            {products.map((product) => (
                                <div key={product.id} className="product-item">
                                    <img src={product.thumbnail} alt={product.title} className="product-image"/>
                                    <div className="product-info">
                                        <h3 className="product-title">{product.title}</h3>
                                        <p className="product-price">${product.price}</p>
                                        <p className="product-store">Por {product.seller
                                                ?.nickname}</p>
                                    </div>

                                    <div className="product-buttons">
                                        <Link to={`/product/${product.id}`} className="btn-detail">Ver Detalle</Link>
                                        <button className="btn-add-cart">Agregar al Carrito</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    : (
                        <p>No se han encontrado productos.</p>
                    )
                }
            </div>
        )
    )
}

export default Search;