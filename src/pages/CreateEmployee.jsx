import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEmployee() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [images, setImages] = useState(null);
  const [msg, setMsg] = useState("");

  const [employee, setEmployee] = useState({
    user_id: "",
    department_id: "",
    phone: "",
    address: "",
    designation: "",
    salary: "",
    skills: [],
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [usersRes, deptsRes, skillsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/user/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/skills", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsers(usersRes.data);
      setDepartments(deptsRes.data);
      setSkills(skillsRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSkillToggle = (skillId) => {
    setEmployee((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((s) => s !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const createRes = await axios.post(
        "http://localhost:5000/api/employees",
        employee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Upload Images if any
      if (images && images.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
        await axios.post(
          `http://localhost:5000/api/employees/upload/${createRes.data.data.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      setMsg("Employee created successfully!");

      setTimeout(() => {
        navigate("/employee-list");
      }, 1500);
    } catch (err) {
      setMsg(
        err.response?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>
        Create Employee
      </h2>

      {msg && (
        <p
          style={{
            color: msg.includes("success")
              ? "#4ecdc4"
              : "#ff6b6b",
          }}
        >
          {msg}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {/* User */}
        <select
          value={employee.user_id}
          onChange={(e) =>
            setEmployee({
              ...employee,
              user_id: e.target.value,
            })
          }
        >
          <option value="">Select User</option>

          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} - {u.email}
            </option>
          ))}
        </select>

        {/* Department */}
        <select
          value={employee.department_id}
          onChange={(e) =>
            setEmployee({
              ...employee,
              department_id: e.target.value,
            })
          }
        >
          <option value="">Select Department</option>

          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.department_name}
            </option>
          ))}
        </select>

        {/* Mobile */}
        <input
          type="text"
          placeholder="Mobile Number"
          value={employee.phone}
          onChange={(e) =>
            setEmployee({
              ...employee,
              phone: e.target.value,
            })
          }
        />

        {/* Address */}
        <textarea
          placeholder="Address"
          value={employee.address}
          onChange={(e) =>
            setEmployee({
              ...employee,
              address: e.target.value,
            })
          }
        />

        {/* Designation */}
        <select
          value={employee.designation}
          onChange={(e) =>
            setEmployee({
              ...employee,
              designation: e.target.value,
            })
          }
        >
          <option value="">Select Designation</option>
          <option value="Software Developer">
            Software Developer
          </option>
          <option value="Frontend Developer">
            Frontend Developer
          </option>
          <option value="Backend Developer">
            Backend Developer
          </option>
          <option value="Full Stack Developer">
            Full Stack Developer
          </option>
          <option value="HR Executive">
            HR Executive
          </option>
          <option value="HR Manager">
            HR Manager
          </option>
          <option value="Accountant">
            Accountant
          </option>
          <option value="Team Lead">
            Team Lead
          </option>
          <option value="Project Manager">
            Project Manager
          </option>
          <option value="Intern">
            Intern
          </option>
        </select>

        {/* Salary */}
        <input
          type="number"
          placeholder="Salary"
          value={employee.salary}
          onChange={(e) =>
            setEmployee({
              ...employee,
              salary: e.target.value,
            })
          }
        />

        {/* Profile Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>Upload Images (Max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
            style={{
              padding: "10px",
              background: "#1a1a2e",
              color: "#fff",
              border: "1px solid #4ecdc4",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Skills */}
        <div>
          <h4 style={{ color: "#fff" }}>Skills</h4>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {skills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() =>
                  handleSkillToggle(skill.id)
                }
                style={{
                  padding: "8px 15px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  background: employee.skills.includes(
                    skill.id
                  )
                    ? "#4ecdc4"
                    : "#2a2a3e",
                  color: "#fff",
                }}
              >
                {skill.skill_name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#4ecdc4",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create Employee
        </button>
      </form>
    </div>
  );
}

export default CreateEmployee;
