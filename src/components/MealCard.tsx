import React from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { Meal } from '../types/Meal';

type Props = {
  meal: Meal;
  onDelete: (id: string) => void;
  onEdit: (meal: Meal) => void;
};

export default function MealCard({ meal, onDelete, onEdit }: Props) {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white space-y-2 relative">
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={() => onEdit(meal)}
          className="text-blue-500 hover:text-blue-700"
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(meal.id)}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          <FaTrashAlt />
        </button>
      </div>
      <h2 className="text-xl font-semibold">{meal.name}</h2>
      <p className="text-sm text-gray-500">
        {meal.mealType} • {meal.date}
      </p>
      <p>Calories: {meal.calories} kcal</p>
      <p>
        Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g
      </p>
    </div>
  );
}
