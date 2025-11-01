import React from "react";
import "../styles/Products.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button>Detail</button>
    </div>
  );
};

export default ProductCard;
