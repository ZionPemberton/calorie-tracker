import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './lib/firebase';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProfilePage from './pages/Profile';
import Navbar from './components/NavBar';

import { useUser } from './context/UserContext';

import LogMealForm from './components/LogMealForm';
import MealCard from './components/MealCard';
import MacroPieChart from './components/MacroPieChart';
import WeeklyCalorieTrend from './components/WeeklyTrendChart';

import FriendsPage from './pages/FriendsPage';
import FriendStatsPage from './pages/FriendStatsPage';

import { Meal } from './types/Meal';

import Tabs from './components/ui/Tabs';

import NutritionixSearch from './components/NutritionixSearch';

function ProtectedHome() {
  const { user } = useUser();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'meals'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Meal, 'id'>)
      }));
      setMeals(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddMeal = async (meal: Omit<Meal, 'id'>) => {
    if (!user) return;

    if (editingMeal) {
      await updateDoc(doc(db, 'meals', editingMeal.id), {
        ...meal,
        userId: user.uid
      });
      setEditingMeal(null);
    } else {
      await addDoc(collection(db, 'meals'), {
        ...meal,
        userId: user.uid
      });
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'meals', id));
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
  };

  const mealsToDisplay = meals.filter(meal => meal.date === selectedDate);

  const totalMacros = mealsToDisplay.reduce(
    (totals, meal) => ({
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
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
        existing.calories += meal.calories;
      } else {
        acc.push({ date, calories: meal.calories });
      }
      return acc;
    }, [] as { date: string; calories: number }[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!user) return <Navigate to="/signin" replace />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Nutrition Tracker</h1>

      {/* 🔍 Nutritionix Search Bar */}
      <div className="mb-4">
        <NutritionixSearch onAddMeal={handleAddMeal} selectedDate={selectedDate} />
      </div>

      <div className="mb-4 text-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded text-center"
        />
      </div>

      <LogMealForm onAddMeal={handleAddMeal} editingMeal={editingMeal} />

      <div className="mb-6">
        <Tabs
          tabs={[
            {
              label: 'Macronutrient Breakdown',
              content: (
                <MacroPieChart
                  protein={totalMacros.protein}
                  carbs={totalMacros.carbs}
                  fat={totalMacros.fat}
                />
              ),
            },
            {
              label: 'Weekly Calorie Trend',
              content: <WeeklyCalorieTrend data={trendData} />,
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        {mealsToDisplay.length === 0 ? (
          <p className="text-center text-gray-500">No meals logged for this day.</p>
        ) : (
          mealsToDisplay.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              onDelete={handleDeleteMeal}
              onEdit={handleEditMeal}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedHome />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/friends/:friendId" element={<FriendStatsPage />} />
      </Routes>
    </Router>
  );
}
