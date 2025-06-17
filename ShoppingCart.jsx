import React, { useEffect } from 'react';
import { useCart } from "./CartStore";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const TAX_RATE = 0.09;

const ShoppingCart = () => {
    const {
        cart,
        fetchCart,
        modifyQuantity,
        removeFromCart,
        isLoading
    } = useCart();

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        console.log("Current cart:", cart);
    }, [cart]);

  const handleCheckout = async () => {
  try {
    // 1️⃣ Step 1: Buat order terlebih dahulu ke backend Anda
    const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: cart.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price
        })),
        customer_id: 2 // Replace with actual customer ID
      }),
    });

    const rawOrderText = await orderResponse.text();
    const orderData = JSON.parse(rawOrderText);

    if (!orderResponse.ok || !orderData.order_id) {
      throw new Error(orderData.error || "Failed to create order");
    }

    console.log(`✅ Order #${orderData.order_id} created`);

    // 2️⃣ Step 2: Buat Stripe Checkout session berdasarkan order yang dibuat
    const stripeResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: cart.map((item) => ({
          menu_item_id: item.menu_item_id,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        })),
        customer_id: 2,
        order_id: orderData.order_id // optional, for metadata
      }),
    });

    const stripeData = await stripeResponse.json();

    if (!stripeData.url) {
      throw new Error("Stripe session failed to create");
    }

    // 3️⃣ Redirect ke Stripe
    window.location.href = stripeData.url;

  } catch (error) {
    console.error("Checkout error:", error);
    alert(`Checkout failed: ${error.message}`);
  }
};

    // Perhitungan subtotal total
    const subtotal = cart.reduce((sum, item) =>
        sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0
    );
    const taxAmount = subtotal * TAX_RATE;
    const total = subtotal + taxAmount;

    return (
        <div className="container mt-4">
            <h2>Ordering Cart</h2>
            {isLoading ? (
                <p>Loading cart...</p>
            ) : cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul className="list-group">
                        {cart.map((item) => (
                            <li
                                key={item.order_item_id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${item.image_url}`}
                                        alt={item.productName || "Product"}
                                        className="cart-image"
                                        style={{ width: "304px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                                        onError={(e) => { e.target.src = "/placeholder.png"; }}
                                    />
                                    <h5>{item.productName || "No name"}</h5>
                                    <div className="d-flex align-items-center mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-secondary me-2"
                                            onClick={() => {
                                                if (item.quantity > 1) {
                                                    modifyQuantity(item.menu_item_id, item.quantity - 1);
                                                }
                                            }}
                                            disabled={isLoading}
                                        >
                                            -
                                        </button>

                                        <p className="mb-0">Quantity: {item.quantity}</p>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-secondary ms-2"
                                            onClick={() => modifyQuantity(item.menu_item_id, item.quantity + 1)}
                                            disabled={isLoading}
                                        >
                                            +
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger ms-3"
                                            onClick={() => removeFromCart(item.menu_item_id)}
                                            disabled={isLoading}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <span>
                                    ${((Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2))}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-3 text-end">
                        <h5>Subtotal: ${subtotal.toFixed(2)}</h5>
                        <h5>Tax (9%): ${taxAmount.toFixed(2)}</h5>
                        <h4>Total: ${total.toFixed(2)}</h4>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={handleCheckout}
                            disabled={isLoading || cart.length === 0}
                        >
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;
