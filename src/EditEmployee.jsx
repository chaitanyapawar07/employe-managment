import { useState } from "react";

function EditEmployee() {
  const [employee, setEmployee] = useState({
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    mobile: "9876543210",
    designation: "Software Developer",
    salary: "45000",
  });

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Employee Updated Successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Employee</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          name="name"
          value={employee.name}
          onChange={handleChange}
          placeholder="Employee Name"
        />

        <input
          type="email"
          name="email"
          value={employee.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          type="text"
          name="mobile"
          value={employee.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
        />

        <select
          name="designation"
          value={employee.designation}
          onChange={handleChange}
        >
          <option>Software Developer</option>
          <option>HR Executive</option>
          <option>Accountant</option>
          <option>Manager</option>
          <option>Team Lead</option>
        </select>

        <input
          type="number"
          name="salary"
          value={employee.salary}
          onChange={handleChange}
          placeholder="Salary"
        />

        <button type="submit">
          Update Employee
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;