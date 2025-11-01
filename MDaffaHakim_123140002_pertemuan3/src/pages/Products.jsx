import React, { useState } from "react";
import "../styles/Products.css";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import { useCart } from "../context/CartContext";

function Products() {
  const { addToCart, cartItems } = useCart();
  const [quantities, setQuantities] = useState({});

  const products = [
    {
      id: 1,
      name: "Stiker BUMH",
      price: 15000,
      image: hero1,
      desc: "Stiker eksklusif BUMH dengan desain premium dan daya tahan tinggi.",
    },
    {
      id: 2,
      name: "Gelang BUMH",
      price: 20000,
      image: hero2,
      desc: "Gelang karet BUMH bergaya minimalis — simbol semangat komunitas kreatif.",
    },
    {
      id: 3,
      name: "Gantungan Kunci BUMH",
      price: 18000,
      image: hero3,
      desc: "Ganci BUMH lucu dan kokoh, cocok buat tas atau kunci kamu!",
    },
  ];

  return (
    <div className="products-page fade-in">
      <h2 className="products-title">Produk Kami</h2>
      <p className="products-subtitle">
        Temukan merchandise eksklusif dari BUMH — desain keren, kualitas terjamin!
      </p>

      <div className="product-grid">
        {products.map((p) => {
          const cartItem = cartItems.find(item => item.id === p.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          
          return (
            <div key={p.id} className="product-card">
              <div className="product-image-container">
                <img src={p.image} alt={p.name} className="product-image" />
                {quantity > 0 && (
                  <div className="product-badge">{quantity}</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-desc">{p.desc}</p>
                <p className="product-price">Rp {p.price.toLocaleString()}</p>
                <div className="product-actions">
                  <button 
                    className="add-btn" 
                    onClick={() => {
                      addToCart(p);
                      setQuantities(prev => ({
                        ...prev,
                        [p.id]: (prev[p.id] || 0) + 1
                      }));
                    }}
                  >
                    {quantity === 0 ? 'Tambah ke Keranjang' : 'Tambah Lagi'}
                  </button>
                  {quantity > 0 && (
                    <span className="quantity-info">
                      Dalam keranjang: {quantity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
