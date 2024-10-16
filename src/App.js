import {React, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import NavBar from './components/NavBar/NavBar';
import Product from './components/Product/Product';
import Search from './components/Search/Search';
import Category from './components/Category/Category';

function App() {
    const [cartItems, setCartItems] = useState([]);

    const addItemToCartItems = (newItem) => {
        const existingItem = cartItems.find(item => item.product.id === newItem.product.id);
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.product.id === newItem.product.id
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
            ));
        } else setCartItems([...cartItems, newItem]);
    };

    const updateCartItems = (updateItem) => {
        const newList = cartItems.map((item) => {
            if (item.product.id === updateItem.product.id) {
                if (updateItem.quantity <= 0) return null;
                else if(updateItem.quantity <= item.product.initial_quantity) return updateItem;
                else return item;
            }
            else return item;
        }) 
        setCartItems(newList.filter((item) => item !== null));
    }

    return (
        <Router>
            <NavBar cartItemsLenght={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
            {
                /*
                Reduce toma dos argumentos: una función de callback y un valor inicial (en este caso, 0).
                La función de callback toma dos parámetros: sum (el acumulador) e item (el elemento actual del array).
                En cada iteración, sum se incrementa por la cantidad (quantity) del item actual.
                El resultado final de reduce es la suma de las cantidades de todos los elementos en el carrito.
                */
            }
                
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/search/:query" element={<Search/>} />
                <Route path="/cart" element={<Cart updateCartItems={updateCartItems} cartItems={cartItems}/>} />
                <Route path="/product/:id" element={<Product addItemToCartItems={addItemToCartItems} cartItems={cartItems}/>} />
                <Route path="/category/:id" element={<Category />} />
            </Routes>
        </Router>
    );
}

export default App;
