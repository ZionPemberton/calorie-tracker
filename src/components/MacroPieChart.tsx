import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MacroPieChart({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  const data = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fat (g)'],
    datasets: [
      {
        label: 'Macronutrients',
        data: [protein, carbs, fat],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Protein
          'rgba(255, 206, 86, 0.6)',  // Carbs
          'rgba(255, 99, 132, 0.6)'   // Fat
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Macronutrient Breakdown</h2>
      <Pie data={data} />
    </div>
  );
}