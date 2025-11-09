import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    setUpdating(true);
    try {
      await api.put(`/cart/${itemId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update cart");
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(true);
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear the cart?")) {
      return;
    }

    setUpdating(true);
    try {
      await api.delete("/cart");
      await fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to clear cart");
    } finally {
      setUpdating(false);
    }
  };

  const getTotal = () => {
    return (
      cart.items?.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ) || 0
    );
  };

  const getShipping = () => {
    return getTotal() > 500 ? 0 : 50;
  };

  const getGrandTotal = () => {
    return getTotal() + getShipping();
  };

  const proceedToCheckout = () => {
    if (cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🛒 Shopping Cart</h1>
        <button onClick={() => navigate("/")} style={styles.backButton}>
          Continue Shopping
        </button>
      </header>

      <div style={styles.content}>
        {cart.items?.length === 0 ? (
          <div style={styles.emptyCart}>
            <h2>Your cart is empty</h2>
            <button
              onClick={() => navigate("/")}
              style={styles.shopButton}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div style={styles.cartItems}>
              {cart.items.map((item) => (
                <div key={item._id} style={styles.cartItem}>
                  <div style={styles.itemImage}>
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} />
                    ) : (
                      <div style={styles.placeholderImage}>📦</div>
                    )}
                  </div>
                  <div style={styles.itemDetails}>
                    <h3 style={styles.itemName}>{item.product.name}</h3>
                    <p style={styles.itemPrice}>
                      ₹{item.product.price} / {item.product.unit}
                    </p>
                  </div>
                  <div style={styles.itemControls}>
                    <div style={styles.quantityControl}>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        disabled={updating}
                        style={styles.quantityButton}
                      >
                        -
                      </button>
                      <span style={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        disabled={updating || item.quantity >= item.product.stock}
                        style={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                    <div style={styles.itemTotal}>
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      disabled={updating}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={clearCart}
                disabled={updating}
                style={styles.clearButton}
              >
                Clear Cart
              </button>
            </div>

            <div style={styles.summary}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              <div style={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping:</span>
                <span>
                  {getShipping() === 0 ? "Free" : `₹${getShipping().toFixed(2)}`}
                </span>
              </div>
              {getTotal() < 500 && (
                <div style={styles.freeShipping}>
                  Add ₹{(500 - getTotal()).toFixed(2)} more for free shipping!
                </div>
              )}
              <div style={styles.summaryRowTotal}>
                <span>Total:</span>
                <span>₹{getGrandTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={proceedToCheckout}
                style={styles.checkoutButton}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontSize: "24px",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#4CAF50",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    gap: "20px",
  },
  cartItems: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "15px",
    display: "flex",
    gap: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  itemImage: {
    width: "100px",
    height: "100px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderImage: {
    fontSize: "40px",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    margin: "0 0 10px 0",
    color: "#333",
  },
  itemPrice: {
    color: "#666",
    margin: 0,
  },
  itemControls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  quantityButton: {
    width: "30px",
    height: "30px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    borderRadius: "4px",
    cursor: "pointer",
  },
  quantity: {
    minWidth: "30px",
    textAlign: "center",
  },
  itemTotal: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#4CAF50",
  },
  removeButton: {
    padding: "5px 15px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  clearButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  summary: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    height: "fit-content",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    width: "300px",
  },
  summaryTitle: {
    margin: "0 0 20px 0",
    color: "#333",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    color: "#666",
  },
  summaryRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #ddd",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  freeShipping: {
    color: "#4CAF50",
    fontSize: "14px",
    marginBottom: "15px",
    fontStyle: "italic",
  },
  checkoutButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
  },
  emptyCart: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "white",
    borderRadius: "8px",
    width: "100%",
  },
  shopButton: {
    padding: "15px 30px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
  },
};

export default Cart;

