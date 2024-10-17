import React from 'react'; // Importa React
import PropTypes from 'prop-types'; // Importa PropTypes para la validación de tipos
import './Cart.css'; // Importa estilos para el componente
import { Link } from 'react-router-dom'; // Importa Link para la navegación

const Cart = ({ updateCartItems, cartItems }) => {

  // Maneja el caso donde no se recuperan los items del carrito
  if (!cartItems) {
    return (
      <div className="container">
        <p>Error recuperando el carrito de compras...</p>
      </div>
    );
  } 
  // Maneja el caso donde el carrito está vacío
  else if (cartItems.length === 0) {
    return (
      <div className="container">
        <img src='.././img/carrito.png' className='product-image' alt="Carrito vacío"/>
        <p>No hay productos en el carrito de compras.</p>
      </div>
    );
  }

  // Calcular el total del carrito por moneda
  const totals = cartItems.reduce(
    (suma, item) => {
      const price = item.product.price || 0; // Si el precio es nulo, usar 0
      const currency = item.product.currency_id;

      // Suma el precio según la moneda
      if (currency === 'ARS') suma.pesos += price * item.quantity;
      else if (currency === 'USD') suma.dolares += price * item.quantity;

      return suma;
    },
    { pesos: 0, dolares: 0 } // Estado inicial
  );

  return (
    <div className="container">
      <h2 className="title-cart">Mi carrito</h2>
      <div className="cart-container">
        <div className="cart-items">
          {
            cartItems.map((item, index) => (
              <div key={index} className="cart-item-card">
                <div className="cart-item-body">
                  <img src={item.product.thumbnail} alt={item.product.title} className="cart-item-image"/>

                  <div className="cart-item-info">
                    <Link to={`/product/${item.product.id}`}>
                      <h1 className="product-view-title">{item.product.title}</h1>
                    </Link>

                    <div className="cart-item-quantity">
                      {/* Botones para aumentar y disminuir la cantidad */}
                      <button className="quantity-button" onClick={() => updateCartItems({product: item.product, quantity: item.quantity - 1})}>-</button>
                      <span className='quantity'>{item.quantity}</span>
                      <button className="quantity-button" onClick={() => updateCartItems({product: item.product, quantity: item.quantity + 1})}>+</button>
                    </div>
                    <p className="product-view-stock">{item.product.initial_quantity} unidad(es) disponibles</p>

                    <p className="product-price">
                      {item.product.currency_id} {item.product.price ? item.product.price.toLocaleString() : '0'}
                    </p>

                    {item.product.shipping.free_shipping && <p className="product-shipping">Envío gratis</p>}
                  </div>
                </div>

                {/* Botón para eliminar el item del carrito */}
                <button className="remove-item" onClick={() => updateCartItems({product: item.product, quantity: 0})}>Eliminar</button>
              </div>
            ))
          }
        </div>

        <div className="cart-summary">
          <h2>Resumen de compra</h2>
          <p>Productos ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</p>
          
          {/* Mostrar los totales separados por moneda */}
          {totals.pesos > 0 && <p>Total en pesos (ARS): ${totals.pesos.toLocaleString()}</p>}
          {totals.dolares > 0 && <p>Total en dólares (USD): ${totals.dolares.toLocaleString()}</p>}
        </div>
      </div>
    </div>
  );
};

// PropTypes para la validación de las propiedades del componente
Cart.propTypes = {
  updateCartItems: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired
};

export default Cart; // Exporta el componente para su uso en otras partes de la aplicación
