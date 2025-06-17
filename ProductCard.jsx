import React from 'react';
export default function ProductCard(props) {
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
  const imagePath = props.image_url.replace(/^\//, '');

  return (
    <div className="card h-100 shadow-sm position-relative">
      {/* Badge atau label favorit */}
      {props.orderCount && (
        <span
          className="badge bg-danger position-absolute top-0 start-0 m-2"
          style={{ fontSize: "0.8rem" }}
        >
          🔥 Favorite ({props.orderCount})
        </span>
      )}

      <img
        src={`${baseUrl}/${imagePath}`}
        className="card-img-top"
        alt={props.productName}
      />
      <div className="card-body">
        <h5 className="card-title">{props.productName}</h5>
        <p className="card-text">${props.price}</p>
        <a
          href="#"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            props.onAddToCart();
          }}
        >
          Add to Cart
        </a>
      </div>
    </div>
  );
}

