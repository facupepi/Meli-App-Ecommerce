import { React, useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import PropTypes from 'prop-types'; // Importar PropTypes
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa los estilos del carrusel
import { IoArrowUndoOutline } from "react-icons/io5";
/*Se utiliza para capturar el ID del producto desde la URL.*/

import "./Product.css";

function Product({addItemToCartItems, cartItems}) {
  const { id } = useParams(); // Extrae el ID de la URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity,setQuantity] = useState(0);
  const navigate = useNavigate(); // Para regresar a la página anterior

  useEffect(() => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);

        fetch(`https://api.mercadolibre.com/items/${id}/description`)
          .then((response) => response.json())
          .then((data) => setProduct((prevProduct) => ({ ...prevProduct, description: data.plain_text })))
          .catch((error) => setError(error))
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
    
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const existingItem = cartItems.find(item => item.product.id === product.id);

    if(existingItem && existingItem.quantity + quantity > product.initial_quantity) alert(`Stock Insuficiente (${product.initial_quantity}). Esta tratando de agregar ${quantity} items, pero en el carrito ya posee ${existingItem.quantity} items. Agregue una menor cantidad...`);
    else addItemToCartItems({product, quantity: quantity})
  }

  const onChangeQuantity = (e) => {
    const value = Number(e.target.value);
    value <= product.initial_quantity 
      ? setQuantity(value)
      : setQuantity(product.initial_quantity);
  }

  if (loading) return (
    <div className="container h-100">
    <svg className="loading" viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
    </svg>
</div>
  )
  else if (error) return (
    <div className="container">
      <p>Error al cargar el producto.</p>;
    </div>
  )
  else
    return (
      <div className="container">
        <button onClick={() => navigate(-1)} className="product-view-back-btn"><IoArrowUndoOutline />Regresar a Listado</button>
        <div className="product-view-container">
          <Carousel showArrows={true} infiniteLoop={true} showThumbs={true}>
            {product.pictures.map((picture, index) => <img key={index} src={picture.secure_url} alt={`Imagen ${index + 1} de ${product.title}`}/>)}
          </Carousel>

          <div className="product-view-details-section">
            <h1 className="product-view-title">{product.title}</h1>
            {product.shipping.free_shipping? <p className="product-shipping">Envío gratis</p> : null}

            <p className="product-condition">Condición: {product.condition === 'new' ? 'Nuevo' : 'Usado'}</p>

            {product.price
              ? <p className="product-price"> {product.currency_id} {product.price}</p>
              : <p className="product-price">Consultar Precio</p>
            }

            <p className="product-view-stock">{product.initial_quantity} unidad(es) disponibles</p>
            
            <form onSubmit={handleOnSubmit} className="product-view-form">
              <label htmlFor='quantity' className="product-view-label">Cantidad</label>
              <input id="quantity" name="quantity" type="number" placeholder='Cantidad...' value={quantity} onChange={(e) => onChangeQuantity(e)} className="product-view-quantity-input"/>
              
              <div className='product-view-buttons'>
              <button type='button' onClick={() => setQuantity(prev => (prev <= 0 ? 0 : prev - 1))} className='product-view-quantity-button' aria-label='Boton quitar 1 a cantidad'>-</button>
              
                <button type='button' onClick={() => setQuantity(prev => (prev >= product.initial_quantity ? product.initial_quantity : prev + 1))} className='product-view-quantity-button' aria-label='Boton añadir 1 a cantidad'>+</button>
                
                
              </div>

              <button className="product-view-add-to-cart-btn" type="submit" disabled={quantity <= 0 || quantity > product.initial_quantity}>Agregar al carrito</button>
            </form>
              

            <div className="product-view-description">
              {product.description 
              ? product.description.split('\n').map(
                (line, index) => <p key={index}>{line}</p>) // Cada línea se convierte en un párrafo
              : <p>No hay descripción disponible.</p>}
            </div>
            
            {
              product.attributes && product.attributes.length > 0 && (
                <div className="product-view-atributes">
                  <h2>Características</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Característica</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody> 
                      {product.attributes.map((attribute, index) => (
                        <tr key={index}>
                          <td>{attribute.name}</td>
                          <td>{attribute.value_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
}

Product.propTypes = {
  addItemToCartItems: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired
};

export default Product;
