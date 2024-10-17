import { React, useState, useEffect } from "react"; 
import { useNavigate, useParams } from "react-router-dom"; // Hooks para navegación y obtener parámetros de la URL
import { Carousel } from "react-responsive-carousel"; // Componente de carrusel para imágenes
import PropTypes from 'prop-types'; // Para validación de propiedades

import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa estilos del carrusel
import { IoArrowUndoOutline } from "react-icons/io5"; // Icono de retroceso
import { Modal, Button } from "react-bootstrap"; // Modal y botón de react-bootstrap
import "./Product.css"; // Estilos del componente

function Product({ addItemToCartItems, cartItems }) {
  const { id } = useParams(); // Extrae el ID del producto de la URL
  const [product, setProduct] = useState(null); // Estado para almacenar el producto
  const [error, setError] = useState(null); // Estado para manejar errores
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [quantity, setQuantity] = useState(0); // Estado para la cantidad de productos a agregar al carrito
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad de la modal
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    // Solicitud para obtener los detalles del producto
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data); // Guarda los datos del producto en el estado
        setLoading(false); // Cambia el estado de carga a falso

        // Solicitud para obtener la descripción del producto
        fetch(`https://api.mercadolibre.com/items/${id}/description`)
          .then((response) => response.json())
          .then((data) => setProduct((prevProduct) => ({ ...prevProduct, description: data.plain_text }))) // Agrega la descripción al producto
          .catch((error) => setError(error)); // Manejo de errores
      })
      .catch((error) => {
        setError(error); // Manejo de errores
        setLoading(false); // Cambia el estado de carga a falso
      });
  }, [id]); // Se ejecuta cuando el `id` cambia

  // Maneja la suma de productos al carrito
  const handleOnSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    const existingItem = cartItems.find(item => item.product.id === product.id); // Verifica si el producto ya está en el carrito

    // Si ya existe y se excede la cantidad permitida, muestra la modal
    if (existingItem && existingItem.quantity + quantity > product.initial_quantity) {
      setShowModal(true); // Muestra la modal de advertencia
    } else {
      addItemToCartItems({ product, quantity }); // Agrega el producto al carrito
    }
  };

  // Maneja el cambio en la cantidad del producto
  const onChangeQuantity = (e) => {
    const value = Number(e.target.value); // Convierte el valor a número
    // Actualiza la cantidad si está dentro de los límites
    value <= product.initial_quantity 
      ? setQuantity(value)
      : setQuantity(product.initial_quantity);
  };

  // Si está cargando, muestra un spinner
  if (loading) return (
    <div className="container h-100">
      <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );

  // Si hay un error, muestra un mensaje de error
  else if (error) return (
    <div className="container">
      <p>Error al cargar el producto.</p>
    </div>
  );

  // Si no hay errores y se cargó el producto, muestra la información
  else
    return (
      <div className="container">
        {/* Botón para regresar a la lista de productos */}
        <button onClick={() => navigate(-1)} className="product-view-back-btn"><IoArrowUndoOutline />Regresar a Listado</button>
        <div className="product-view-container">
          {/* Carrusel de imágenes del producto */}
          <Carousel showArrows={true} infiniteLoop={true} showThumbs={true}>
            {product.pictures.map((picture, index) => (
              <img key={index} src={picture.secure_url} alt={`Imagen ${index + 1} de ${product.title}`}/>
            ))}
          </Carousel>

          <div className="product-view-details-section">
            <h1 className="product-view-title">{product.title}</h1>
            {/* Muestra si el envío es gratuito */}
            {product.shipping.free_shipping ? <p className="product-shipping">Envío gratis</p> : null}

            <p className="product-condition">Condición: {product.condition === 'new' ? 'Nuevo' : 'Usado'}</p>

            {/* Muestra el precio o un mensaje de precio no disponible */}
            {product.price
              ? <p className="product-price"> {product.currency_id} {product.price}</p>
              : <p className="product-price">Consultar Precio</p>
            }

            <p className="product-view-stock">{product.initial_quantity} unidad(es) disponibles</p>
            
            {/* Formulario para agregar productos al carrito */}
            <form onSubmit={handleOnSubmit} className="product-view-form">
              <label htmlFor='quantity' className="product-view-label">Cantidad</label>
              <input id="quantity" name="quantity" type="number" placeholder='Cantidad...' value={quantity} onChange={(e) => onChangeQuantity(e)} className="product-view-quantity-input"/>
              
              <div className='product-view-buttons'>
                {/* Botones para aumentar o disminuir la cantidad */}
                <button type='button' onClick={() => setQuantity(prev => (prev <= 0 ? 0 : prev - 1))} className='product-view-quantity-button' aria-label='Boton quitar 1 a cantidad'>-</button>
                <button type='button' onClick={() => setQuantity(prev => (prev >= product.initial_quantity ? product.initial_quantity : prev + 1))} className='product-view-quantity-button' aria-label='Boton añadir 1 a cantidad'>+</button>
              </div>

              <button className="product-view-add-to-cart-btn" type="submit" disabled={quantity <= 0 || quantity > product.initial_quantity}>Agregar al carrito</button>
            </form>
              
            {/* Muestra la descripción del producto */}
            <div className="product-view-description">
              {product.description 
              ? product.description.split('\n').map(
                (line, index) => <p key={index}>{line}</p>) // Convierte cada línea en un párrafo
              : <p>No hay descripción disponible.</p>}
            </div>
            
            {/* Muestra las características del producto si están disponibles */}
            {product.attributes && product.attributes.length > 0 && (
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
            )}
          </div>
        </div>

        {/* Modal que se muestra cuando hay stock insuficiente */}
        <Modal show={showModal} onHide={() => setShowModal(false)} >
          <Modal.Header closeButton>
            <Modal.Title>Advertencia de Stock</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Stock insuficiente (solo hay ${product.initial_quantity}) y usted ya posee unidades del producto en el carrito. Agregue una menor cantidad...`}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

// Definición de los tipos de propiedades que espera recibir el componente
Product.propTypes = {
  addItemToCartItems: PropTypes.func.isRequired, // Función para agregar elementos al carrito
  cartItems: PropTypes.array.isRequired // Array que contiene los elementos del carrito
};

export default Product; // Exporta el componente para su uso en otras partes de la aplicación
