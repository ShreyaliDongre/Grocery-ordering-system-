import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCart();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/products/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (productId) => {
    setCartLoading(true);
    try {
      await api.post("/cart", { productId, quantity: 1 });
      await fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getCartTotal = () => {
    return (
      cart.items?.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ) || 0
    ).toFixed(2);
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🛒 Grocery Store</h1>
        <div style={styles.headerRight}>
          <button
            onClick={() => navigate("/cart")}
            style={styles.cartButton}
          >
            Cart ({getCartItemCount()}) - ₹{getCartTotal()}
          </button>
          <button
            onClick={() => navigate("/orders")}
            style={styles.ordersButton}
          >
            My Orders
          </button>
          <span style={styles.userName}>{user?.name}</span>
          <button 
            onClick={() => {
              logout();
              navigate("/login");
            }} 
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.categorySelect}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.productsGrid}>
          {products.map((product) => (
            <div key={product._id} style={styles.productCard}>
              <div style={styles.productImage}>
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div style={styles.placeholderImage}>📦</div>
                )}
              </div>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productDescription}>{product.description}</p>
              <div style={styles.productInfo}>
                <span style={styles.productPrice}>₹{product.price}</span>
                <span style={styles.productUnit}>/{product.unit}</span>
              </div>
              <div style={styles.productStock}>
                Stock: {product.stock} {product.unit}
              </div>
              <button
                onClick={() => addToCart(product._id)}
                disabled={cartLoading || product.stock === 0}
                style={{
                  ...styles.addButton,
                  ...(product.stock === 0 ? styles.disabledButton : {}),
                }}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div style={styles.noProducts}>No products found</div>
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
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  logo: {
    margin: 0,
    fontSize: "24px",
  },
  headerRight: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  cartButton: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#4CAF50",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  ordersButton: {
    padding: "10px 20px",
    backgroundColor: "#45a049",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  userName: {
    fontWeight: "bold",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },
  searchInput: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  categorySelect: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    minWidth: "200px",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  productImage: {
    width: "100%",
    height: "200px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
  },
  placeholderImage: {
    fontSize: "60px",
  },
  productName: {
    margin: "0 0 10px 0",
    color: "#333",
  },
  productDescription: {
    color: "#666",
    fontSize: "14px",
    margin: "0 0 10px 0",
    flexGrow: 1,
  },
  productInfo: {
    display: "flex",
    alignItems: "baseline",
    marginBottom: "10px",
  },
  productPrice: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#4CAF50",
  },
  productUnit: {
    fontSize: "14px",
    color: "#666",
    marginLeft: "5px",
  },
  productStock: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "15px",
  },
  addButton: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
  },
  noProducts: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#666",
  },
};

export default Home;

