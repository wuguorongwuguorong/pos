import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useCart } from './CartStore';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const { showMessage } = useFlashMessage();
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();

  const handleAddToCart = (product) => {
    addToCart({
      order_item_id: Math.floor(Math.random() * 9999 + 1),
      menu_item_id: product.menu_item_id,
      productName: product.menu_item_name,
      image_url: product.image_url,
      price: product.price,
      quantity: 1,
    });

    showMessage("Product added to cart", "success");
    setLocation("/cart");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">All Menu</h1>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 mb-4" key={product.menu_item_id}>
            <ProductCard
              menu_item_id={product.menu_item_id}
              productName={product.menu_item_name}
              price={product.price}
              image_url={product.image_url}
              onAddToCart={() => handleAddToCart(product)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductPage;

