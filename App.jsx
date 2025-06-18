import React, { useState } from 'react';
import ProductCard from './ProductCard';
import Navbar from './Navbar';
import HomePage from './HomePage';
import ProductPage from './ProductPage';
import RegisterPage from './RegisterPage';
import Login from './UserLogin';
import Profile from './Profile';
import ShoppingCart from './ShoppingCart';
import { Route, Switch } from 'wouter';
import './styles.css';


function App() {

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={Login} />
        <Route path='/profile' component={Profile}/>
        <Route path="/cart" component={ShoppingCart} />
      </Switch>

  
      <footer className="bg-dark text-white text-center py-3">
        <div className="container">
          <p>&copy; 2025 Hungry Panda. All rights reserved.</p>
        </div>
      </footer>

    </>
  )
}

export default App
