import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Clear form fields when component mounts or when navigating to login
  useEffect(() => {
    // Always clear form when component mounts
    const clearForm = () => {
      setFormData({
        email: "",
        password: "",
      });
      setError("");
      
      // Clear input fields explicitly to remove browser autofill
      if (emailInputRef.current) {
        emailInputRef.current.value = "";
        emailInputRef.current.blur();
      }
      if (passwordInputRef.current) {
        passwordInputRef.current.value = "";
        passwordInputRef.current.blur();
      }
    };

    clearForm();
    
    // Also clear after a short delay to handle browser autofill
    const timer = setTimeout(() => {
      clearForm();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form} autoComplete="off" key="login-form">
          <input
            ref={emailInputRef}
            type="email"
            name="email"
            id="login-email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            data-form-type="other"
            required
            style={styles.input}
          />
          <input
            ref={passwordInputRef}
            type="password"
            name="password"
            id="login-password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            data-form-type="other"
            required
            style={styles.input}
          />
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#ffe6e6",
    borderRadius: "4px",
  },
  link: {
    textAlign: "center",
    marginTop: "20px",
    color: "#666",
  },
};

export default Login;

