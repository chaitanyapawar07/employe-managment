import NavBar from "../components/NavBar";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Verify from '../pages/Verify';
import LeaveApplication from '../pages/LeaveApplication';
import ManageLeaves from '../pages/ManageLeaves';
import LeaveHistory from '../pages/LeaveHistory';
import AdminDashboard from "../pages/AdminDashboard";
import HRApproval from "../pages/HRApproval";
import Reports from '../pages/Reports';
import CreateEmployee from "../pages/CreateEmployee";
import Departments from '../pages/Departments';
import EmployeeList from "../pages/EmployeeList";
import EditEmployee from "../pages/EditEmployee";
import SkillsMaster from "../pages/SkillsMaster";
import Profile from "../pages/Profile";
import AssetManagement from '../pages/AssetManagement';
import Notifications from "../pages/Notifications";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const noSidebarRoutes = ["/", "/signup", "/forgot-password"];

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const showSidebar = !noSidebarRoutes.includes(location.pathname) &&
    !location.pathname.startsWith("/reset/") &&
    !location.pathname.startsWith("/verify/");

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const unread = res.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    if (showSidebar) fetchUnread();
  }, [location.pathname]);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {showSidebar && <NavBar />}

      <div style={{ marginLeft: showSidebar ? "260px" : "0", flex: 1, minHeight: "100vh" }}>
        
        {/* TOP HEADER BAR */}
        {showSidebar && (
          <div style={{
            position: "sticky", top: 0, zIndex: 100,
            display: "flex", justifyContent: "flex-end", alignItems: "center",
            padding: "12px 24px",
            background: "var(--bg-secondary, #1a1a2e)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            <button
              onClick={() => navigate("/notifications")}
              style={{
                position: "relative", background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)", borderRadius: "50%",
                width: "42px", height: "42px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#818cf8", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.3)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  background: "#ef4444", color: "white",
                  borderRadius: "50%", width: "18px", height: "18px",
                  fontSize: "11px", fontWeight: "bold",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid var(--bg-secondary, #1a1a2e)"
                }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/apply-leave" element={<LeaveApplication />} />
          <Route path="/manage-leaves" element={<ManageLeaves />} />
          <Route path="/leave-history" element={<LeaveHistory />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/hr-approval" element={<ProtectedRoute><HRApproval /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/create-employee" element={<ProtectedRoute><CreateEmployee /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><SkillsMaster /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/assets" element={<AssetManagement />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/edit-employee/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
          <Route path="/employee-list" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;