import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    if (user?.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
      if (response.data.items.length === 0) {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      setError("Please fill in all address fields");
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });
      navigate("/orders", { state: { orderId: response.data._id } });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
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

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🛒 Checkout</h1>
        <button onClick={() => navigate("/cart")} style={styles.backButton}>
          Back to Cart
        </button>
      </header>

      <div style={styles.content}>
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Shipping Address</h2>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={shippingAddress.street}
              onChange={handleAddressChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={shippingAddress.state}
              onChange={handleAddressChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={shippingAddress.zipCode}
              onChange={handleAddressChange}
              required
              style={styles.input}
            />

            <h2 style={styles.sectionTitle}>Payment Method</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={styles.select}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI</option>
            </select>

            <button
              type="submit"
              disabled={placingOrder}
              style={styles.placeOrderButton}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        <div style={styles.summary}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          {cart.items?.map((item) => (
            <div key={item._id} style={styles.summaryItem}>
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
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
          <div style={styles.summaryRowTotal}>
            <span>Total:</span>
            <span>₹{getGrandTotal().toFixed(2)}</span>
          </div>
        </div>
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
  formSection: {
    flex: 1,
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "30px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  placeOrderButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  summary: {
    width: "350px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    height: "fit-content",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    color: "#666",
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
  error: {
    color: "red",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#ffe6e6",
    borderRadius: "4px",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
  },
};

export default Checkout;

