import React, { useContext } from "react";
import "../styles/Cart.css";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Keranjang Belanja</h1>
        {cartItems.length > 0 && (
          <span className="cart-count">{cartItems.length} item</span>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Keranjang Belanja Kosong</h2>
          <p>Yuk tambahkan produk favorit kamu!</p>
          <button className="browse-btn" onClick={() => navigate('/products')}>
            Lihat Produk
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image-container">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-price">Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <span className="quantity-label">Jumlah:</span>
                      <div className="quantity-buttons">
                        <button className="qty-btn" onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}>
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <span className="remove-icon">×</span>
                      Hapus
                    </button>
                  </div>
                </div>
                <div className="item-subtotal">
                  <p className="subtotal-label">Subtotal:</p>
                  <p className="subtotal-amount">Rp {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Pengiriman</span>
                <span className="shipping-info">Dihitung saat checkout</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="cart-actions">
              <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                Lanjut ke Checkout
              </button>
              <button className="clear-cart-btn" onClick={clearCart}>
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
