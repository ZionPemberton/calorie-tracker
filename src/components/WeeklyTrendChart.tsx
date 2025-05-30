import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  data: { date: string; calories: number }[]; // Accepts array of objects
};

export default function WeeklyCalorieTrend({ data }: Props) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Calories',
        data: data.map(d => d.calories),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Weekly Calorie Trend</h2>
      <Line data={chartData} />
    </div>
  );
}
