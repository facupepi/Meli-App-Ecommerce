import React from 'react';
import './Home.css';

function Home({ products }) {
  return (
    <div className="container">
      <h2>Productos encontrados</h2>
      {products ? (
      <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <a href={product.permalink} className="product-link" target="_blank" rel="noopener noreferrer">
            <img src={product.thumbnail} alt={product.title} className="product-image" />
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">${product.price}</p>
              <p className="product-store">Por {product.seller?.nickname}</p>
            </div>
          </a>
        </div>
      ))}
    </div>
      ) : (
        <p>No se han encontrado productos.</p>
      )}
    </div>
  );
}

export default Home;
