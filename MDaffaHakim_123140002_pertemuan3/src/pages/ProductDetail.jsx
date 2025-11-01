import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import stiker from "../assets/hero1.png";
import gelang from "../assets/hero2.png";
import ganci from "../assets/hero3.png";
import "../styles/ProductDetail.css";
import { CartContext } from "../context/CartContext";

const data = [
  { id: 1, name: "Stiker BUMH", price: 10000, image: stiker, description: "Stiker vinyl tahan air dengan desain eksklusif." },
  { id: 2, name: "Gelang Karet", price: 15000, image: gelang, description: "Gelang karet dengan logo himpunan, nyaman dipakai." },
  { id: 3, name: "Gantungan Kunci", price: 12000, image: ganci, description: "Ganci akrilik full print, cocok jadi merchandise event." },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const product = data.find((p) => p.id === parseInt(id));
  if (!product) return <div style={{ padding: 50 }}>Produk tidak ditemukan</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <img src={product.image} alt={product.name} />
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h3>Rp {product.price.toLocaleString()}</h3>
          <div className="detail-actions">
            <button className="add-to-cart" onClick={() => addToCart(product)}>Tambah ke Keranjang</button>
            <button className="btn-secondary" onClick={() => navigate(-1)}>Kembali</button>
          </div>
        </div>
      </div>
    </div>
  );
}
