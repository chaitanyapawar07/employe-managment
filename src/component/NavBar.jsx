import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, Home, Users, UserPlus, List, 
  Calendar, FileText, History, CheckSquare, 
  Building, Star, User, BarChart2, LogOut, 
  ChevronDown, ChevronRight, Monitor 
} from 'lucide-react';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({
    employee: true,
    leave: true
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      {/* Brand Title */}
      <div className="sidebar-header">
        <LayoutGrid className="logo-icon" size={20} />
        <h2>ERP System</h2>
      </div>

      {/* Main Navigation links */}
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
          <Home size={18} />
          <span>Dashboard</span>
        </Link>

        {/* EMPLOYEE MANAGEMENT GROUP */}
        <div className="nav-group">
          <div className="nav-group-header" onClick={() => toggleMenu('employee')}>
            <span className="nav-group-title">EMPLOYEE MANAGEMENT</span>
            {openMenus.employee ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          
          {openMenus.employee && (
            <div className="nav-sub-items">
              <Link to="/create-employee" className={`sub-item ${isActive('/create-employee')}`}>
                <UserPlus size={14} />
                <span>Create Employee</span>
              </Link>
              <Link to="/employee-list" className={`sub-item ${isActive('/employee-list')}`}>
                <List size={14} />
                <span>Employee List</span>
              </Link>
            </div>
          )}
        </div>

        {/* LEAVE MANAGEMENT GROUP */}
        <div className="nav-group">
          <div className="nav-group-header" onClick={() => toggleMenu('leave')}>
            <span className="nav-group-title">LEAVE MANAGEMENT</span>
            {openMenus.leave ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          
          {openMenus.leave && (
            <div className="nav-sub-items">
              <Link to="/apply-leave" className={`sub-item ${isActive('/apply-leave')}`}>
                <FileText size={14} />
                <span>Apply Leave</span>
              </Link>
              <Link to="/leave-history" className={`sub-item ${isActive('/leave-history')}`}>
                <History size={14} />
                <span>Leave History</span>
              </Link>
              <Link to="/manage-leaves" className={`sub-item ${isActive('/manage-leaves')}`}>
                <CheckSquare size={14} />
                <span>Manage Leaves</span>
              </Link>
            </div>
          )}
        </div>

        {/* SINGLE NAVIGATION ITEMS */}
        <Link to="/departments" className={`nav-item ${isActive('/departments')}`}>
          <Building size={18} />
          <span>Departments</span>
        </Link>
        
        <Link to="/skills" className={`nav-item ${isActive('/skills')}`}>
          <Star size={18} />
          <span>Skills Master</span>
        </Link>

        {/* ADDED ASSETS BUTTON HERE */}
        <Link to="/assets" className={`nav-item ${isActive('/assets')}`}>
          <Monitor size={18} />
          <span>Assets</span>
        </Link>

        <Link to="/profile" className={`nav-item ${isActive('/profile')}`}>
          <User size={18} />
          <span>Profile / Reports</span>
        </Link>

        <Link to="/reports" className={`nav-item ${isActive('/reports')}`}>
          <BarChart2 size={18} />
          <span>Reports</span>
        </Link>
      </nav>

      {/* FOOTER USER PROFILE & LOGOUT */}
      <div className="sidebar-footer">
        <div className="user-info">
          <User size={16} />
          <span>chaitanya pawar</span>
        </div>
        <button className="logout-btn">
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
