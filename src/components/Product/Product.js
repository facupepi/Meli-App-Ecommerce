import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa los estilos del carrusel
/*Se utiliza para capturar el ID del producto desde la URL.*/

import "./Product.css";

function Product() {
  const { id } = useParams(); // Extrae el ID de la URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  else if (error) return <p>Error al cargar el producto.</p>;
  else
    return (
      <div className="container">
        <div className="product-view-container">
          <Carousel showArrows={true} infiniteLoop={true} showThumbs={true}>
            {product.pictures.map((picture, index) => (
              <img
                key={index}
                src={picture.secure_url}
                alt={`Imagen ${index + 1} de ${product.title}`}
              />
            ))}
          </Carousel>

          <div className="product-view-details-section">
            <h1 className="product-view-title">{product.title}</h1>

            <p className="product-view-price">${product.price}</p>

            <p className="product-view-stock">
              {product.initial_quantity} unidad(es) disponibles
            </p>

            <button className="product-view-add-to-cart-btn">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    );
}

export default Product;
