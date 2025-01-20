import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  
} from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const StatisticsChart = ({ totaloccupancy, overduePayments, ongoingIncidents, totalResidents }) => {
  const data = {
    labels: ['Taux d’Occupation', 'Paiements en Retard', 'Incidents en Cours', 'Total Résidents'],
    datasets: [
      {
        label: 'Statistiques',
        data: [totaloccupancy, overduePayments, ongoingIncidents, totalResidents],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += Math.round(context.raw);
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, 
        },
        title: {
          display: true,
          text: 'Nombre',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Catégories',
        },
      },
    },
  };

  return (
    <div>
      <h2>Statistiques Générales</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StatisticsChart;