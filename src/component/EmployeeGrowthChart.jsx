import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function EmployeeGrowthChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        fill: true,
        label: 'Total Employees',
        data: [10, 15, 22, 30, 42, 55],
        borderColor: '#a259ff',
        backgroundColor: 'rgba(162, 89, 255, 0.15)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8c8c9e' } },
      y: { grid: { color: '#222230' }, ticks: { color: '#8c8c9e' } },
    },
  };

  return (
    <div style={{ backgroundColor: '#13131a', padding: '20px', borderRadius: '12px', border: '1px solid #222230', height: '300px' }}>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '16px' }}>Employee Headcount Growth</h3>
      <div style={{ height: '220px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
