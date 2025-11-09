import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#4CAF50";
      case "Shipped":
        return "#2196F3";
      case "Processing":
        return "#FF9800";
      case "Cancelled":
        return "#f44336";
      default:
        return "#666";
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>📦 My Orders</h1>
        <button onClick={() => navigate("/")} style={styles.backButton}>
          Continue Shopping
        </button>
      </header>

      <div style={styles.content}>
        {orders.length === 0 ? (
          <div style={styles.emptyOrders}>
            <h2>You have no orders yet</h2>
            <button
              onClick={() => navigate("/")}
              style={styles.shopButton}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <h3 style={styles.orderId}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </div>
                </div>

                <div style={styles.orderItems}>
                  {order.orderItems.map((item, index) => (
                    <div key={index} style={styles.orderItem}>
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.orderAddress}>
                  <strong>Shipping Address:</strong>
                  <p>
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    , {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                </div>

                <div style={styles.orderFooter}>
                  <div style={styles.orderTotals}>
                    <div style={styles.totalRow}>
                      <span>Items:</span>
                      <span>₹{order.itemsPrice.toFixed(2)}</span>
                    </div>
                    <div style={styles.totalRow}>
                      <span>Shipping:</span>
                      <span>
                        {order.shippingPrice === 0
                          ? "Free"
                          : `₹${order.shippingPrice.toFixed(2)}`}
                      </span>
                    </div>
                    <div style={styles.totalRowTotal}>
                      <span>Total:</span>
                      <span>₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div style={styles.paymentInfo}>
                    <strong>Payment:</strong> {order.paymentMethod}
                    {order.isPaid && (
                      <span style={styles.paidBadge}>✓ Paid</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  orderCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #eee",
  },
  orderId: {
    margin: "0 0 5px 0",
    color: "#333",
  },
  orderDate: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
  },
  statusBadge: {
    padding: "5px 15px",
    borderRadius: "20px",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
  },
  orderItems: {
    marginBottom: "20px",
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
    color: "#666",
  },
  orderAddress: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
  },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
  orderTotals: {
    flex: 1,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    color: "#666",
  },
  totalRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #ddd",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  paymentInfo: {
    textAlign: "right",
    color: "#666",
  },
  paidBadge: {
    display: "block",
    marginTop: "5px",
    color: "#4CAF50",
    fontWeight: "bold",
  },
  emptyOrders: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "white",
    borderRadius: "8px",
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

export default Orders;

