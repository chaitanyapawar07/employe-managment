import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [joinData, setJoinData] = useState({ join1: [], join2: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJoins = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/reports/joins", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJoinData(res.data);
      } catch (err) {
        setError("Failed to fetch join reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJoins();
  }, []);

  return (
    <div className="fade-in" style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>User Profile</h2>
      
      <div className="dashboard-card" style={{ marginBottom: "30px", padding: "20px" }}>
        <h3 style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "10px", marginBottom: "20px", color: "var(--primary-accent)" }}>
          Personal Information
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <strong style={{ color: "var(--text-secondary)" }}>Name:</strong> <br />
            <span style={{ fontSize: "16px" }}>{user?.name}</span>
          </div>
          <div>
            <strong style={{ color: "var(--text-secondary)" }}>Email:</strong> <br />
            <span style={{ fontSize: "16px" }}>{user?.email}</span>
          </div>
          <div>
            <strong style={{ color: "var(--text-secondary)" }}>Role:</strong> <br />
            <span style={{ fontSize: "16px", textTransform: "capitalize" }}>{user?.role || "User"}</span>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>SQL JOIN Assignment Reports</h2>
      
      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading queries...</p>
      ) : (
        <>
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ color: "var(--secondary-accent)", marginBottom: "15px" }}>
              Join 1: Employees and Departments
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "10px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px", fontFamily: "monospace" }}>
              SELECT u.name, d.department_name FROM employee_profiles ep INNER JOIN users u ON ep.user_id = u.id INNER JOIN departments d ON ep.department_id = d.id;
            </p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department Name</th>
                </tr>
              </thead>
              <tbody>
                {joinData.join1.length === 0 ? (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>No records found.</td>
                  </tr>
                ) : (
                  joinData.join1.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.name}</td>
                      <td>{row.department_name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div>
            <h3 style={{ color: "var(--secondary-accent)", marginBottom: "15px" }}>
              Join 2: Employees and Skills
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "10px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px", fontFamily: "monospace" }}>
              SELECT u.name, s.skill_name FROM employee_skills es INNER JOIN employee_profiles ep ON es.employee_id = ep.id INNER JOIN users u ON ep.user_id = u.id INNER JOIN skills s ON es.skill_id = s.id;
            </p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Skill Name</th>
                </tr>
              </thead>
              <tbody>
                {joinData.join2.length === 0 ? (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>No records found.</td>
                  </tr>
                ) : (
                  joinData.join2.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.name}</td>
                      <td>{row.skill_name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
