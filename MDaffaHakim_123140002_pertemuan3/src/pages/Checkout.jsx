import React, { useContext, useState } from "react";
import "../styles/Checkout.css";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import SuccessPopup from "../components/SuccessPopup";

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "Transfer Bank",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Keranjang kosong.");
    setSubmitting(true);          // blokir tombol
    setShowPopup(true);           // tampilkan popup — jangan clearCart di sini
    // jangan navigate di sini; akan di-handle di onClose
  };

  const handlePopupClose = () => {
    // clear cart setelah popup selesai
    clearCart();
    setShowPopup(false);
    setSubmitting(false);
    navigate("/"); // kembali ke home
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Tidak ada produk di keranjang 😿</h2>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-summary">
          <h2>Ringkasan Pesanan</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity} = Rp {(item.price * item.quantity).toLocaleString()}
              </li>
            ))}
          </ul>
          <h3>Total: Rp {total.toLocaleString()}</h3>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Data Pembeli</h2>

          <label>Nama Lengkap</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Alamat Lengkap</label>
          <textarea name="address" value={formData.address} onChange={handleChange} required />

          <label>Nomor HP</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

          <label>Metode Pembayaran</label>
          <select name="payment" value={formData.payment} onChange={handleChange}>
            <option>Transfer Bank</option>
            <option>COD (Bayar di Tempat)</option>
            <option>QRIS</option>
          </select>

          <div className="checkout-total">Total: Rp {total.toLocaleString()}</div>

          <button type="submit" className="checkout-btn" disabled={submitting}>
            {submitting ? "Memproses..." : "Pesan Sekarang"}
          </button>
        </form>
      </div>

      {showPopup && (
        <SuccessPopup
          message={`Terima kasih ${formData.name || "Pembeli"}!\nPesanan Anda telah diterima.\nTotal: Rp ${total.toLocaleString()}`}
          duration={3500}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}
