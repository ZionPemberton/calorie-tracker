import React, { useEffect, useState } from 'react';
import { Meal } from '../types/Meal';

type Props = {
  onAddMeal: (meal: Omit<Meal, 'id'>) => Promise<void>;
  editingMeal?: Meal | null;
};

export default function LogMealForm({ onAddMeal, editingMeal }: Props) {
  const [form, setForm] = useState<Omit<Meal, 'id'>>({
    name: '',
    mealType: 'Breakfast',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingMeal) {
      const { id, ...rest } = editingMeal;
      setForm(rest);
    }
  }, [editingMeal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        name === 'calories' || name === 'protein' || name === 'carbs' || name === 'fat'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddMeal(form); // ✅ Await the async function
    setForm({
      name: '',
      mealType: 'Breakfast',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Meal Name"
          className="border p-2 rounded w-full"
          required
        />
        <select
          name="mealType"
          value={form.mealType}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
        <input
          type="number"
          name="calories"
          value={form.calories}
          onChange={handleChange}
          placeholder="Calories"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="protein"
          value={form.protein}
          onChange={handleChange}
          placeholder="Protein (g)"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="carbs"
          value={form.carbs}
          onChange={handleChange}
          placeholder="Carbs (g)"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="fat"
          value={form.fat}
          onChange={handleChange}
          placeholder="Fat (g)"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {editingMeal ? 'Update Meal' : 'Add Meal'}
      </button>
    </form>
  );
}
