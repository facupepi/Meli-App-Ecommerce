import {React, useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importación de los componentes
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Product from './components/Product/Product';
import Search from './components/Search/Search';
import Category from './components/Category/Category';

// Importación de los estilos
import './App.css';

// Componente principal de la aplicación
function App() {
    // Estado inicial del carrito, cargado desde localStorage (si existe)
    const [cartItems, setCartItems] = useState(() => {
        try {
            // Se intenta obtener los elementos del carrito almacenados en localStorage
            const cartItemsSaved = JSON.parse(localStorage.getItem('cartItems') || '[]');
            // Si hay elementos guardados, se retorna; si no, retorna un array vacío
            return cartItemsSaved.length > 0 ? cartItemsSaved : [];
        } catch (e) {
            // Manejo de errores si hay algún problema al acceder al localStorage
            console.error('Error al acceder a localStorage', e);
            return [];
        }
    });

    // useEffect para guardar el estado del carrito en localStorage cuando `cartItems` cambie
    useEffect(() => {
        console.log("Guardado");
        // Guardamos el carrito en localStorage cada vez que se actualiza el estado `cartItems`
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]); // Dependencia en `cartItems`, esto asegura que el guardado solo ocurra cuando este cambie

    // Función para añadir un nuevo item al carrito
    const addItemToCartItems = (newItem) => {
        // Buscamos si el producto ya existe en el carrito
        const existingItem = cartItems.find(item => item.product.id === newItem.product.id);
        if (existingItem) {
            // Si ya existe, aumentamos la cantidad del producto existente
            setCartItems(cartItems.map(item =>
                item.product.id === newItem.product.id
                    ? { ...item, quantity: item.quantity + newItem.quantity } // Actualizamos la cantidad
                    : item
            ));
        } else {
            // Si no existe, lo agregamos como un nuevo producto al carrito
            setCartItems([...cartItems, newItem]);
        }
    };

    // Función para actualizar la cantidad de un producto en el carrito
    const updateCartItems = (updateItem) => {
        // Mapeamos sobre los elementos actuales del carrito
        const newList = cartItems.map((item) => {
            // Si el producto a actualizar coincide con uno en el carrito
            if (item.product.id === updateItem.product.id) {
                // Si la cantidad es <= 0, eliminamos el producto del carrito (retornando null)
                if (updateItem.quantity <= 0) return null;
                // Si la cantidad es válida, actualizamos el producto
                else if (updateItem.quantity <= item.product.initial_quantity) return updateItem;
                // Si la cantidad es inválida (superior al stock disponible), no se actualiza
                else return item;
            } else {
                // Si no es el producto a actualizar, lo dejamos tal cual
                return item;
            }
        });
        // Filtramos los valores nulos (productos eliminados) del array
        setCartItems(newList.filter((item) => item !== null));
    };

    return (
        // Definimos el Router para las rutas de la aplicación
        <Router>
            {/* Componente NavBar: se le pasa como prop la longitud del carrito */}
            <NavBar cartItemsLenght={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
                
            <Routes>
                {/* Ruta para la página de inicio */}
                <Route path="/" element={<Home/>} />
                {/* Ruta para la página de búsqueda */}
                <Route path="/search/:query" element={<Search/>} />
                {/* Ruta para la página del carrito*/}
                <Route path="/cart" element={<Cart updateCartItems={updateCartItems} cartItems={cartItems}/>} />
                {/* Ruta para la página de producto*/}
                <Route path="/product/:id" element={<Product addItemToCartItems={addItemToCartItems} cartItems={cartItems}/>} />
                {/* Ruta para la página de categorías hijas de una categoria Padre */}
                <Route path="/category/:id" element={<Category />} />
            </Routes>

            <Footer />
            
        </Router>

    );
}

export default App;

{
    /* ANEXO: Explicación de la función `reduce` en el cálculo del total del carrito
    La función `reduce` toma dos argumentos: una función de callback y un valor inicial (en este caso, 0).
    La función de callback toma dos parámetros: `sum` (el acumulador) e `item` (el elemento actual del array).
    En cada iteración, sum se incrementa por la cantidad (`quantity`) del item actual.
    El resultado final es la suma total de las cantidades de todos los elementos en el carrito.
    */
}