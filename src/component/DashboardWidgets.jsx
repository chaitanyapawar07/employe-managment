import React from 'react';

export function QuickActions() {
  const actions = [
    { label: '+ Add Employee', color: '#00f2fe', bg: 'rgba(0, 242, 254, 0.1)' },
    { label: '📝 Request Leave', color: '#a259ff', bg: 'rgba(162, 89, 255, 0.1)' },
    { label: '⚙️ System Settings', color: '#8c8c9e', bg: 'rgba(140, 140, 158, 0.1)' },
  ];

  return (
    <div style={widgetStyle}>
      <h3 style={titleStyle}>Quick Actions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
        {actions.map((act, idx) => (
          <button key={idx} style={{
            backgroundColor: act.bg,
            color: act.color,
            border: `1px solid ${act.color}33`,
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}>
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RecentActivity() {
  const activities = [
    { text: 'New employee onboarded to IT Dept.', time: '2 hrs ago', icon: '👤' },
    { text: 'Leave request approved for Jane Doe', time: '5 hrs ago', icon: '✅' },
    { text: 'Skills matrix updated for Marketing', time: 'Yesterday', icon: '📊' },
  ];

  return (
    <div style={widgetStyle}>
      <h3 style={titleStyle}>Recent Activity</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        {activities.map((act, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px' }}>{act.icon}</span>
            <div>
              <p style={{ color: '#fff', margin: 0, fontSize: '14px' }}>{act.text}</p>
              <span style={{ color: '#8c8c9e', fontSize: '11px' }}>{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Common styles matching your current layout
const widgetStyle = {
  backgroundColor: '#13131a',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #222230',
  minHeight: '220px',
};

const titleStyle = {
  color: '#fff',
  margin: 0,
  fontSize: '16px',
  fontWeight: '500',
};