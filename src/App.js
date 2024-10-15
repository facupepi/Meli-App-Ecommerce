import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import NavBar from './components/NavBar/NavBar';
import Product from './components/Product/Product';
import Search from './components/Search/Search';
import Category from './components/Category/Category';

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/search/:query" element={<Search/>} />
                <Route path="/cart" element={<Cart/>} />
                <Route path="/product/:id" element={<Product/>} />
                <Route path="/category/:id" element={<Category />} />
            </Routes>
        </Router>
    );
}

export default App;
