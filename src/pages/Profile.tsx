import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { Meal } from '../types/Meal';

export default function ProfilePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    gender: '',
    age: '',
    startWeight: '',
    dailyCalorieTarget: '',
  });
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          gender: data.gender || '',
          age: data.age || '',
          startWeight: data.startWeight || '',
          dailyCalorieTarget: data.dailyCalorieTarget || '',
        });
      }
      setLoading(false);
    };

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'meals'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      ),
      snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Meal, 'id'>)
        }));
        setMeals(data);
      }
    );

    fetchProfile();
    return () => unsubscribe();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const docRef = doc(db, 'profiles', user.uid);
    await setDoc(docRef, profile);
    alert('Profile saved!');
  };

  const today = new Date().toISOString().split('T')[0];
  const todayCalories = meals
    .filter(meal => meal.date === today)
    .reduce((sum, meal) => sum + meal.calories, 0);

  const past7Days = meals.filter(meal => {
    const mealDate = new Date(meal.date);
    const now = new Date();
    const diffTime = now.getTime() - mealDate.getTime();
    return diffTime / (1000 * 60 * 60 * 24) <= 6; // last 7 days including today
  });

  const weeklyAvg = past7Days.length > 0
    ? Math.round(past7Days.reduce((sum, meal) => sum + meal.calories, 0) / 7)
    : 0;

  const calorieTarget = Number(profile.dailyCalorieTarget) || 1;
  const todayProgress = Math.min((todayCalories / calorieTarget) * 100, 100);
  const weeklyProgress = Math.min((weeklyAvg / calorieTarget) * 100, 100);

  const getBarColor = (percentage: number) => {
    if (percentage < 70) return 'bg-yellow-400';
    if (percentage <= 100) return 'bg-green-500';
    return 'bg-red-500';
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="gender" value={profile.gender} onChange={handleChange} placeholder="Gender" className="border p-2 rounded w-full" />
        <input type="number" name="age" value={profile.age} onChange={handleChange} placeholder="Age" className="border p-2 rounded w-full" />
        <input type="number" name="startWeight" value={profile.startWeight} onChange={handleChange} placeholder="Start Weight (kg)" className="border p-2 rounded w-full" />
        <input type="number" name="dailyCalorieTarget" value={profile.dailyCalorieTarget} onChange={handleChange} placeholder="Daily Calorie Target" className="border p-2 rounded w-full" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Save Profile</button>
      </form>

      <div className="mt-6 space-y-6">
        <div className="p-4 bg-gray-50 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Calories: {todayCalories} / {calorieTarget} kcal</h3>
          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(todayProgress)} transition-all`} style={{ width: `${todayProgress}%` }} />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Weekly Avg Calories: {weeklyAvg} / {calorieTarget} kcal</h3>
          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(weeklyProgress)} transition-all`} style={{ width: `${weeklyProgress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
