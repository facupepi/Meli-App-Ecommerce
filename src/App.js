import {React, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import NavBar from './components/NavBar/NavBar';
import Product from './components/Product/Product';
import Search from './components/Search/Search';
import Category from './components/Category/Category';

const request = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
};

function App() {
    const [listOfProducts,setListOfProducts] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);

    function onSubmitSearch(query) {
        setLoading(true);
        if(query == '') setListOfProducts(null);
        else{
          fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`, request).then((response) => {
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            return response.json();
        }).then((data) => {
            setListOfProducts(data.results);
            setLoading(false);
            setError(null);
        }).catch((error) => {
            setError(error);
            setLoading(false);
            setListOfProducts(null);
        });
        }
    }

    return (
        <Router>
            <NavBar onSubmitSearch={onSubmitSearch}/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/search/:query" element={<Search products={listOfProducts} loading={loading}/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/product/:id" element={<Product/>}/>
                <Route path="/category/:id" element={<Category/>}/>
            </Routes>
        </Router>
    );
}

export default App;
