import React from 'react';
import PropTypes from 'prop-types'; 
import './Cart.css';

const Cart = ({ updateCartItems, cartItems }) => {

  if (!cartItems) {
    return (
      <div className="container">
        <p>Error recuperando el carrito de compras...</p>
      </div>
    );
  } else if (cartItems.length === 0) {
    return (
      <div className="container">
        <p>No hay productos en el carrito de compras.</p>
      </div>
    );
  }

  // Calcular el total del carrito
  const total = cartItems.reduce((suma, item) => suma + (item.product.price * item.quantity), 0);

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
                  <h1 className="product-view-title">{item.product.title}</h1>
                  
                  <div className="cart-item-quantity">
                    <button className="quantity-button" onClick={() => updateCartItems({product: item.product, quantity: item.quantity - 1})}>-</button>
                    <span className='quantity'>{item.quantity}</span>
                    <button className="quantity-button" onClick={() => updateCartItems({product: item.product, quantity: item.quantity + 1})}>+</button>
                  </div>
                  <p className="product-view-stock">{item.product.initial_quantity} unidad(es) disponibles</p>

                  {item.product.price
                    ? <p className="product-price"> {item.product.currency_id} {item.product.price.toLocaleString()}</p>
                    : <p className="product-price">Consultar Precio</p>
                  }
                  
                  {item.product.shipping.free_shipping && <p className="product-shipping">Envío gratis</p>}
                  
                </div>
              </div>

              <button className="remove-item" onClick={() => updateCartItems({product: item.product, quantity: 0})}>Eliminar</button>
            </div>
          ))
        }
      </div>

      <div className="cart-summary">
        <h2>Resumen de compra</h2>
        <p>Productos ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</p>
        <p>Total: ${total.toLocaleString()}</p>
      </div>
    </div>
    </div>
  );
};

Cart.propTypes = {
  updateCartItems: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired
};

export default Cart;
