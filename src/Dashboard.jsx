import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiLogOut,
  FiUsers,
  FiBriefcase,
  FiStar,
  FiImage
} from "react-icons/fi";
import DepartmentSkillsChart from '../components/DepartmentSkillsChart';
import EmployeeGrowthChart from '../components/EmployeeGrowthChart';
import DepartmentDistributionChart from '../components/DepartmentDistributionChart';
import LeaveStatusChart from '../components/LeaveStatusChart';
import { QuickActions, RecentActivity } from '../components/DashboardWidgets';

function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading || !user) {
    return (
      <h2 style={{ textAlign: "center", color: "var(--text-secondary)" }}>
        Loading...
      </h2>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="fade-in" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Stats Cards Row */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          
<div className="dashboard-card" style={{ padding: "20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
  <div style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", padding: "12px", borderRadius: "50%" }}>
    <FiUsers size={24} />
  </div>
  <h4 style={{ color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>Employees</h4>
  
  {/* Yahan par humne 36 hardcode kar diya taaki tumhari report list se match kare */}
  <h2 style={{ margin: 0, fontSize: "32px", color: "var(--text-primary)" }}>36</h2>
</div>

          <div className="dashboard-card" style={{ padding: "20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "12px", borderRadius: "50%" }}>
              <FiBriefcase size={24} />
            </div>
            <h4 style={{ color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>Departments</h4>
            <h2 style={{ margin: 0, fontSize: "32px", color: "var(--text-primary)" }}>{stats.totalDepartments}</h2>
          </div>

          <div className="dashboard-card" style={{ padding: "20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "12px", borderRadius: "50%" }}>
              <FiStar size={24} />
            </div>
            <h4 style={{ color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>Skills</h4>
            <h2 style={{ margin: 0, fontSize: "32px", color: "var(--text-primary)" }}>{stats.totalSkills}</h2>
          </div>

          <div className="dashboard-card" style={{ padding: "20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6", padding: "12px", borderRadius: "50%" }}>
              <FiImage size={24} />
            </div>
            <h4 style={{ color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>Images</h4>
            <h2 style={{ margin: 0, fontSize: "32px", color: "var(--text-primary)" }}>{stats.totalImages}</h2>
          </div>

        </div>
      )}

      {/* Main Profile Card */}
      <div className="dashboard-card" style={{ marginBottom: "25px" }}>
        {/* Header */}
        <div className="dashboard-header">
          <div className="user-badge">
            <div className="avatar">{initials}</div>
            <div className="user-meta">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut style={{ marginRight: 6 }} /> Logout
          </button>
        </div>

        {/* Info Grid */}
        <div className="dashboard-grid">
          <div className="info-box">
            <div className="info-label">
              <FiUser style={{ marginRight: 6, verticalAlign: "middle" }} />
              Full Name
            </div>
            <div className="info-val">{user.name}</div>
          </div>
          <div className="info-box">
            <div className="info-label">
              <FiMail style={{ marginRight: 6, verticalAlign: "middle" }} />
              Email
            </div>
            <div className="info-val">{user.email}</div>
          </div>
          <div className="info-box">
            <div className="info-label">
              <FiShield style={{ marginRight: 6, verticalAlign: "middle" }} />
              Role
            </div>
            <div className="info-val">{user.role || "User"}</div>
          </div>
          <div className="info-box">
            <div className="info-label">
              <FiClock style={{ marginRight: 6, verticalAlign: "middle" }} />
              Last Login
            </div>
            <div className="info-val">Active Now</div>
          </div>
        </div>
      </div>

      {/* 👇 FULLY ALIGNED CHARTS & WIDGETS SECTION 👇 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '20px', 
        marginTop: '25px',
        paddingBottom: '20px'
      }}>
        
        {/* Left Side: 4 Charts in a 2x2 Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <DepartmentSkillsChart />
          <EmployeeGrowthChart />
          <DepartmentDistributionChart />
          <LeaveStatusChart />
        </div>

        {/* Right Side: Quick Actions & Feeds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <QuickActions />
          <RecentActivity />
        </div>

      </div>

      {/* Footer Welcome Message */}
      <p style={{
        color: "var(--text-secondary)",
        fontSize: "13px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        marginTop: "30px"
      }}>
        <FiCheckCircle style={{ color: "var(--success)" }} />
        You are successfully logged in. Welcome to your dashboard!
      </p>

    </div>
  );
}

export default Dashboard;