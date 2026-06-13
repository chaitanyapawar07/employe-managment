import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DepartmentSkillsChart() {
  const data = {
    labels: ['IT', 'HR', 'Sales', 'Marketing', 'Finance'],
    datasets: [
      {
        label: 'Skills',
        data: [12, 4, 6, 8, 5],
        backgroundColor: '#00f2fe',
        borderRadius: 6,
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
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '16px' }}>Skills per Department</h3>
      <div style={{ height: '220px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}