import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setMessage({ text: "All fields are required", isError: true });
      return;
    }
    setLoading(true);
    setMessage({ text: "", isError: false });
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      setMessage({ text: res.data.message || "Registration successful! Redirecting to login...", isError: false });
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed. Please try again.";
      setMessage({ text: errMsg, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, Arial, sans-serif",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        color: "#fff",
      }}>
        <h2 style={{ margin: "0 0 8px", fontSize: "1.8rem" }}>Create Account ✨</h2>
        <p style={{ margin: "0 0 24px", opacity: 0.7, fontSize: "0.95rem" }}>
          Sign up to get started
        </p>

        {message.text && (
          <div style={{
            background: message.isError ? "rgba(229,62,62,0.2)" : "rgba(72,187,120,0.2)",
            border: `1px solid ${message.isError ? "#e53e3e" : "#48bb78"}`,
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "16px",
            fontSize: "0.9rem",
          }}>
            {message.isError ? "⚠️" : "✅"} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "0.9rem", opacity: 0.8 }}>
                {label}
              </label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                required
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              background: loading ? "#555" : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", opacity: 0.8, fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
