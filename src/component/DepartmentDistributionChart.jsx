import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DepartmentDistributionChart() {
  const data = {
    labels: ['IT', 'HR', 'Sales', 'Marketing', 'Finance'],
    datasets: [
      {
        data: [15, 5, 8, 12, 6], // Static data representing employees per dept
        backgroundColor: [
          '#00f2fe', // Cyan
          '#a259ff', // Purple
          '#ff597b', // Pinkish Red
          '#fec200', // Yellow/Gold
          '#00ff87'  // Neon Green
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#8c8c9e',
          font: { size: 12 },
          boxWidth: 15,
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#13131a', padding: '20px', borderRadius: '12px', border: '1px solid #222230', height: '300px' }}>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '16px' }}>Employee Distribution</h3>
      <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
