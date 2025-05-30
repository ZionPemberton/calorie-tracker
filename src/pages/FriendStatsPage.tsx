import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import MacroPieChart from '../components/MacroPieChart';
import WeeklyCalorieTrend from '../components/WeeklyTrendChart';
import { Meal } from '../types/Meal';

export default function FriendStatsPage() {
  const { friendId } = useParams<{ friendId: string }>();
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    if (!friendId) return;

    const q = query(
      collection(db, 'meals'),
      where('userId', '==', friendId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Meal, 'id'>),
      }));
      console.log("Friend meals loaded:", data); // Debugging
      setMeals(data);
    }, (error) => {
      console.error("Error fetching friend's meals:", error);
    });

    return () => unsubscribe();
  }, [friendId]);

  const totalMacros = meals.reduce(
    (totals, meal) => ({
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fat: totals.fat + (meal.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  const trendData = meals
    .filter(meal => {
      const mealDate = new Date(meal.date);
      const now = new Date();
      const daysAgo = (now.getTime() - mealDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 6;
    })
    .reduce((acc, meal) => {
      const date = meal.date;
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.calories += meal.calories || 0;
      } else {
        acc.push({ date, calories: meal.calories || 0 });
      }
      return acc;
    }, [] as { date: string; calories: number }[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Friend's Nutrition Stats</h2>

      <div className="mb-6">
        <MacroPieChart
          protein={totalMacros.protein}
          carbs={totalMacros.carbs}
          fat={totalMacros.fat}
        />
      </div>

      <div>
        <WeeklyCalorieTrend data={trendData} />
      </div>
    </div>
  );
}
