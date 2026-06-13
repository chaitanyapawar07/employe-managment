import React, { useState } from 'react';
import { Bell, Monitor, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import Modal from '../components/Modal'; 
import "./Notifications.css";

const Notifications = () => {
  // Mock data representing asset assignment notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Asset Assigned",
      description: "MacBook Pro 16\" (Serial: MBP-2026-X94) has been assigned to your workspace. Please confirm receipt.",
      type: "assignment",
      status: "pending",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Asset Request Approved",
      description: "Your request for a 27\" Dell UltraSharp 4K Monitor has been approved by the admin team.",
      type: "approval",
      status: "approved",
      time: "Yesterday"
    },
    {
      id: 3,
      title: "Hardware Return Notice",
      description: "Logitech MX Master 3 Mouse deployment period expires in 5 days. Please initiate a renewal if needed.",
      type: "alert",
      status: "warning",
      time: "3 days ago"
    }
  ]);

  // Modal State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNotifId, setActiveNotifId] = useState(null);
  const [declineReason, setDeclineReason] = useState("");

  const handleAccept = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, status: 'accepted' } : notif)
    );
  };

  const triggerDeclineModal = (id) => {
    setActiveNotifId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDecline = () => {
    setNotifications(prev => 
      prev.map(notif => notif.id === activeNotifId ? { ...notif, status: 'rejected' } : notif)
    );
    setIsModalOpen(false);
    setDeclineReason(""); 
  };

  return (
    <div className="notifications-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-title">
          <Bell size={24} className="accent-icon" />
          <h1>Asset & System Notifications</h1>
        </div>
        <p className="header-subtitle">Accept equipment deployments, track logistics updates, and view system logs.</p>
      </div>

      {/* Notifications List Container */}
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={40} className="icon-green" />
            <p>Your inbox is clear! No active asset items found.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="notif-card">
              <div className="notif-icon-wrapper">
                {notif.type === 'assignment' && <Monitor size={20} className="icon-blue" />}
                {notif.type === 'approval' && <CheckCircle size={20} className="icon-green" />}
                {notif.type === 'alert' && <AlertTriangle size={20} className="icon-orange" />}
              </div>
              
              <div className="notif-body">
                <div className="notif-header">
                  <h3>{notif.title}</h3>
                  <span className="notif-time">
                    <Clock size={12} /> {notif.time}
                  </span>
                </div>
                <p className="notif-desc">{notif.description}</p>
                
                {/* Action Row Conditional Rendering */}
                {notif.status === 'pending' && (
                  <div className="notif-actions">
                    <button className="btn-accept" onClick={() => handleAccept(notif.id)}>
                      Accept Equipment
                    </button>
                    <button className="btn-reject" onClick={() => triggerDeclineModal(notif.id)}>
                      Decline
                    </button>
                  </div>
                )}

                {notif.status === 'accepted' && (
                  <span className="status-badge accepted">✓ Asset Accepted & Logged</span>
                )}
                {notif.status === 'rejected' && (
                  <span className="status-badge rejected">✗ Assignment Rejected</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reusable Confirmation Modal Overlay */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Reject Asset Assignment"
      >
        <div className="modal-form-layout">
          <p className="modal-form-instruction">
            Please provide a reason for declining this hardware deployment for audit tracking.
          </p>
          <textarea 
            placeholder="e.g., Received wrong model, physical damage on delivery..." 
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            className="modal-form-textarea"
          />
          <div className="modal-form-actions">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="modal-btn-cancel"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmDecline}
              disabled={!declineReason.trim()}
              className="modal-btn-confirm"
            >
              Confirm Decline
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notifications;