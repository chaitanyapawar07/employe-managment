import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function LeaveStatusChart() {
  const data = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [24, 7, 3], // Mocked leave application request statuses
        backgroundColor: ['#00ff87', '#fec200', '#ff597b'],
        borderRadius: 4,
        barThickness: 18,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Makes the bar chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: '#222230' }, ticks: { color: '#8c8c9e' } },
      y: { grid: { display: false }, ticks: { color: '#8c8c9e' } },
    },
  };

  return (
    <div style={{ backgroundColor: '#13131a', padding: '20px', borderRadius: '12px', border: '1px solid #222230', height: '300px' }}>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '16px' }}>Leave Requests Overview</h3>
      <div style={{ height: '220px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
