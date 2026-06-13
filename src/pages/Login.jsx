import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && user) navigate("/dashboard");
  }, [navigate, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      if (res.data && res.data.token) {
        // Fetch user profile using the new token
        const profileRes = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${res.data.token}` }
        });
        // Set user in AuthContext (also stores tokens in localStorage)
        login(profileRes.data, res.data.token, res.data.refreshToken);
        navigate("/dashboard");
      } else {
        setError("Login succeeded but no token received.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card fade-in">
      <h2>Welcome Back 👋</h2>
      <p className="subtitle">Sign in to your account to continue</p>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In →"}
        </button>
      </form>

<p 
  onClick={() => navigate('/forgot-password')} 
  style={{cursor: 'pointer', color: 'blue', textAlign: 'center'}}
>
  Forgot Password?
</p>

      <p className="toggle-text">
        Don't have an account?{" "}
        <Link to="/signup" className="toggle-link">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;