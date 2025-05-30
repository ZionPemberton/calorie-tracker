import React, { useState } from 'react';
import { Meal } from '../types/Meal';

type Props = {
  onAddMeal: (meal: Omit<Meal, 'id'>) => void;
  selectedDate: string;
};

const NutritionixSearch = ({ onAddMeal, selectedDate }: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const appId = '35d7ebbd';
  const appKey = '1b70314bd31db11c167bbf74a0169d4f';

  const handleSearch = async () => {
    const queryUrl = `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(queryUrl, {
        headers: {
          'x-app-id': appId,
          'x-app-key': appKey,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setResults(data.common || []);
    } catch (err) {
      console.error('Nutritionix search error:', err);
    }
  };

  const handleAdd = async (item: any) => {
    try {
      setLoading(true);
      const res = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'x-app-id': appId,
          'x-app-key': appKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: item.food_name,
        }),
      });

      const data = await res.json();
      const nutrient = data.foods[0]; // should be only one

      const meal: Omit<Meal, 'id'> = {
        name: nutrient.food_name,
        calories: nutrient.nf_calories || 0,
        protein: nutrient.nf_protein || 0,
        carbs: nutrient.nf_total_carbohydrate || 0,
        fat: nutrient.nf_total_fat || 0,
        date: selectedDate,
        mealType: 'Lunch', // You can make this dynamic
      };

      onAddMeal(meal);
      setResults([]);
      setQuery('');
    } catch (error) {
      console.error('Error fetching detailed nutrition info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search food..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      {results.length > 0 && (
        <div className="mt-4 bg-white border rounded shadow p-4 max-h-[400px] overflow-y-auto">
          {results.map((item, idx) => (
            <div key={idx} className="mb-2 border-b pb-2">
              <p className="font-bold">{item.food_name}</p>
              {item.photo?.thumb && (
                <img
                  src={item.photo.thumb}
                  alt={item.food_name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <button
                className="mt-1 bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => handleAdd(item)}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add to Log'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NutritionixSearch;
