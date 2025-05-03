"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import Head from "next/head";

// Types
type Habit = {
  id: string;
  name: string;
  icon: string;
  target: number;
  unit: string;
  frequency: "daily" | "weekly";
  streak: number;
  progress: number;
  color: string;
  history: {
    date: string;
    value: number;
  }[];
};

type SleepData = {
  date: string;
  hours: number;
  quality: number;
  deepSleep: number;
  remSleep: number;
};

type WaterData = {
  date: string;
  amount: number; // in ml
  target: number;
};

type ScreenTimeData = {
  date: string;
  hours: number;
  categories: {
    name: string;
    time: number;
    color: string;
  }[];
};

type UserData = {
  name: string;
  avatar: string;
  joinDate: string;
  longestStreak: number;
  totalCompletions: number;
};

// Mock Data
const initialHabits: Habit[] = [
  {
    id: "1",
    name: "Exercise",
    icon: "🏃‍♂️",
    target: 30,
    unit: "minutes",
    frequency: "daily",
    streak: 5,
    progress: 20,
    color: "#FF6B6B",
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: Math.floor(Math.random() * 45),
    })).reverse(),
  },
  {
    id: "2",
    name: "Meditation",
    icon: "🧘‍♂️",
    target: 15,
    unit: "minutes",
    frequency: "daily",
    streak: 12,
    progress: 15,
    color: "#4ECDC4",
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: Math.floor(Math.random() * 20),
    })).reverse(),
  },
  {
    id: "3",
    name: "Reading",
    icon: "📚",
    target: 30,
    unit: "pages",
    frequency: "daily",
    streak: 3,
    progress: 15,
    color: "#FFD166",
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: Math.floor(Math.random() * 40),
    })).reverse(),
  },
  {
    id: "4",
    name: "Journaling",
    icon: "✏️",
    target: 1,
    unit: "entry",
    frequency: "daily",
    streak: 7,
    progress: 1,
    color: "#6A0572",
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: Math.random() > 0.2 ? 1 : 0,
    })).reverse(),
  },
  {
    id: "5",
    name: "Hydration",
    icon: "💧",
    target: 2000,
    unit: "ml",
    frequency: "daily",
    streak: 15,
    progress: 1500,
    color: "#118AB2",
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 1000 + Math.floor(Math.random() * 1200),
    })).reverse(),
  },
];

const sleepData: SleepData[] = Array.from({ length: 7 }, (_, i) => {
  const hours = 5 + Math.random() * 4;
  return {
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    hours: Number.parseFloat(hours.toFixed(1)),
    quality: Math.floor(Math.random() * 100),
    deepSleep: Number.parseFloat((hours * 0.3).toFixed(1)),
    remSleep: Number.parseFloat((hours * 0.2).toFixed(1)),
  };
}).reverse();

const waterData: WaterData[] = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  amount: 1000 + Math.floor(Math.random() * 1500),
  target: 2500,
})).reverse();

const screenTimeCategories = [
  { name: "Social Media", color: "#FF6B6B" },
  { name: "Productivity", color: "#4ECDC4" },
  { name: "Entertainment", color: "#FFD166" },
  { name: "Education", color: "#118AB2" },
  { name: "Other", color: "#6A0572" },
];

const screenTimeData: ScreenTimeData[] = Array.from({ length: 7 }, (_, i) => {
  const totalHours = 2 + Math.random() * 6;
  return {
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    hours: Number.parseFloat(totalHours.toFixed(1)),
    categories: screenTimeCategories.map((category) => ({
      ...category,
      time: Number.parseFloat((Math.random() * totalHours * 0.6).toFixed(1)),
    })),
  };
}).reverse();

const userData: UserData = {
  name: "Alex Morgan",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  joinDate: "2025-01-15",
  longestStreak: 21,
  totalCompletions: 145,
};

// Main Component
export default function HabitTracker() {
  // State
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "analytics" | "check-in"
  >("dashboard");
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    name: "",
    target: 1,
    unit: "times",
    frequency: "daily",
    color: "#4ECDC4",
    icon: "🎯",
  });
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showHabitDetail, setShowHabitDetail] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Effects
  useEffect(() => {
    // Load data from localStorage if available
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }

    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    // Save habits to localStorage
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    // Save dark mode preference
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Helper Functions
  const displayNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString("en-US", { weekday: "short" }));
    }
    return days;
  };

  const calculateCompletion = (habit: Habit) => {
    return Math.min(100, Math.round((habit.progress / habit.target) * 100));
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Event Handlers
  const handleAddHabit = () => {
    if (!newHabit.name) {
      displayNotification("Please enter a habit name");
      return;
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name || "New Habit",
      icon: newHabit.icon || "🎯",
      target: newHabit.target || 1,
      unit: newHabit.unit || "times",
      frequency: newHabit.frequency || "daily",
      streak: 0,
      progress: 0,
      color: newHabit.color || "#4ECDC4",
      history: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        value: 0,
      })).reverse(),
    };

    setHabits([...habits, habit]);
    setNewHabit({
      name: "",
      target: 1,
      unit: "times",
      frequency: "daily",
      color: "#4ECDC4",
      icon: "🎯",
    });
    setShowAddHabit(false);
    displayNotification(`Habit "${habit.name}" added successfully!`);
  };

  const handleDeleteHabit = (id: string) => {
    const habitToDelete = habits.find((h) => h.id === id);
    setHabits(habits.filter((habit) => habit.id !== id));
    setShowHabitDetail(false);
    displayNotification(`Habit "${habitToDelete?.name}" deleted successfully!`);
  };

  const handleUpdateProgress = (id: string, value: number) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const newProgress = Math.max(0, Math.min(habit.target, value));
          const todayIndex = habit.history.findIndex(
            (day) => day.date === getTodayDate()
          );

          const updatedHistory = [...habit.history];
          if (todayIndex >= 0) {
            updatedHistory[todayIndex].value = newProgress;
          } else {
            updatedHistory.push({
              date: getTodayDate(),
              value: newProgress,
            });
          }

          // Update streak
          let newStreak = habit.streak;
          if (newProgress >= habit.target) {
            newStreak += 1;
          } else if (
            newProgress < habit.target &&
            habit.progress >= habit.target
          ) {
            newStreak = 0;
          }

          return {
            ...habit,
            progress: newProgress,
            streak: newStreak,
            history: updatedHistory,
          };
        }
        return habit;
      })
    );
  };

  const handleViewHabitDetail = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowHabitDetail(true);
  };

  // Components
  const Navbar = () => (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        darkMode ? "bg-gray-900" : "bg-white"
      } shadow-md px-4 py-3`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl">📊</span>
          </motion.div>
          <h1
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            HabitTrack
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1 rounded-md ${
              activeTab === "dashboard"
                ? darkMode
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-800"
                : darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            } transition-colors`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1 rounded-md ${
              activeTab === "analytics"
                ? darkMode
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-800"
                : darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            } transition-colors`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("check-in")}
            className={`px-3 py-1 rounded-md ${
              activeTab === "check-in"
                ? darkMode
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-800"
                : darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            } transition-colors`}
          >
            Check-in
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ring-1 ring-black ring-opacity-5 z-50`}
              >
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span
                      className={`${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Dark Mode
                    </span>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                        darkMode ? "bg-indigo-600" : "bg-gray-300"
                      } transition-colors`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                          darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Notifications
                    </span>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                        notifications ? "bg-indigo-600" : "bg-gray-300"
                      } transition-colors`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                          notifications ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <span
                      className={`block ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Weekly Goal: {weeklyGoal} days
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={weeklyGoal}
                      onChange={(e) =>
                        setWeeklyGoal(Number.parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <img
                        src={userData.avatar || "/placeholder.svg"}
                        alt={userData.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {userData.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Member since{" "}
                          {new Date(userData.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Your Habits
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddHabit(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors"
        >
          Add Habit
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            whileHover={{ y: -5 }}
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            } cursor-pointer`}
            onClick={() => handleViewHabitDetail(habit)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{habit.icon}</span>
                <h3
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {habit.name}
                </h3>
              </div>
              <div
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${habit.color}20`,
                  color: habit.color,
                }}
              >
                {habit.streak} day streak
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Today's Progress
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {habit.progress} / {habit.target} {habit.unit}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateCompletion(habit)}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-1">
                {Array.from({ length: 7 }).map((_, i) => {
                  const dayIndex = habit.history.length - 7 + i;
                  const day = dayIndex >= 0 ? habit.history[dayIndex] : null;
                  const isCompleted = day && day.value >= habit.target;

                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${
                        isCompleted
                          ? "bg-green-500"
                          : day
                          ? "bg-red-400"
                          : darkMode
                          ? "bg-gray-700"
                          : "bg-gray-200"
                      }`}
                    />
                  );
                })}
              </div>
              <span
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Last 7 days
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Sleep Tracking
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                    borderColor: darkMode ? "#374151" : "#e5e7eb",
                    color: darkMode ? "#fff" : "#000",
                  }}
                  formatter={(value) => [`${value} hours`, "Sleep"]}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Avg. Sleep
              </p>
              <p
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {(
                  sleepData.reduce((acc, day) => acc + day.hours, 0) /
                  sleepData.length
                ).toFixed(1)}
                h
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Deep Sleep
              </p>
              <p
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {sleepData[sleepData.length - 1].deepSleep}h
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Sleep Quality
              </p>
              <p
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {sleepData[sleepData.length - 1].quality}%
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Screen Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screenTimeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                    borderColor: darkMode ? "#374151" : "#e5e7eb",
                    color: darkMode ? "#fff" : "#000",
                  }}
                  formatter={(value) => [`${value} hours`, "Screen Time"]}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Bar dataKey="hours" fill="#4ECDC4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Today's Screen Time by Category
            </p>
            <div className="grid grid-cols-2 gap-2">
              {screenTimeData[screenTimeData.length - 1].categories.map(
                (category, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {category.name}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {category.time}h
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Analytics = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Analytics
        </h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div
        className={`p-6 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Weekly Habit Completion
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getWeekDays().map((day, index) => {
                const completedHabits = habits.filter((habit) => {
                  const historyDay =
                    habit.history[habit.history.length - 7 + index];
                  return historyDay && historyDay.value >= habit.target;
                }).length;

                return {
                  day,
                  completed: completedHabits,
                  target: weeklyGoal,
                };
              })}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis dataKey="day" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#fff",
                  borderColor: darkMode ? "#374151" : "#e5e7eb",
                  color: darkMode ? "#fff" : "#000",
                }}
              />
              <Legend />
              <Bar dataKey="completed" name="Completed Habits" fill="#4ECDC4" />
              <Bar dataKey="target" name="Daily Goal" fill="#FFD166" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Habit Completion Rate
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={habits.map((habit) => {
                    const completedDays = habit.history.filter(
                      (day) => day.value >= habit.target
                    ).length;
                    const completionRate = Math.round(
                      (completedDays / habit.history.length) * 100
                    );

                    return {
                      name: habit.name,
                      value: completionRate,
                      color: habit.color,
                    };
                  })}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {habits.map((habit, index) => (
                    <Cell key={`cell-${index}`} fill={habit.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Completion Rate"]}
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                    borderColor: darkMode ? "#374151" : "#e5e7eb",
                    color: darkMode ? "#fff" : "#000",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Water Intake
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                    borderColor: darkMode ? "#374151" : "#e5e7eb",
                    color: darkMode ? "#fff" : "#000",
                  }}
                  formatter={(value) => [`${value} ml`, "Water"]}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#118AB2"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#FFD166"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className={`p-6 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Streak Performance
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="80%"
              barSize={10}
              data={habits.map((habit) => ({
                name: habit.name,
                value: habit.streak,
                fill: habit.color,
              }))}
            >
              <RadialBar background dataKey="value" cornerRadius={10} />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  color: darkMode ? "#fff" : "#000",
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} days`, "Current Streak"]}
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#fff",
                  borderColor: darkMode ? "#374151" : "#e5e7eb",
                  color: darkMode ? "#fff" : "#000",
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const CheckIn = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Daily Check-in
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            darkMode
              ? "bg-indigo-900 text-indigo-200"
              : "bg-indigo-100 text-indigo-800"
          }`}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div
        className={`p-6 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Update Today's Progress
        </h3>
        <div className="space-y-6">
          {habits.map((habit) => (
            <div key={habit.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{habit.icon}</span>
                  <span
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {habit.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    habit.progress >= habit.target
                      ? "text-green-500"
                      : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {habit.progress} / {habit.target} {habit.unit}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max={habit.target * 2}
                  value={habit.progress}
                  onChange={(e) =>
                    handleUpdateProgress(
                      habit.id,
                      Number.parseInt(e.target.value)
                    )
                  }
                  className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${habit.color} 0%, ${
                      habit.color
                    } ${(habit.progress / (habit.target * 2)) * 100}%, ${
                      darkMode ? "#374151" : "#e5e7eb"
                    } ${(habit.progress / (habit.target * 2)) * 100}%, ${
                      darkMode ? "#374151" : "#e5e7eb"
                    } 100%)`,
                  }}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateProgress(
                        habit.id,
                        Math.max(0, habit.progress - 1)
                      )
                    }
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateProgress(habit.id, habit.progress + 1)
                    }
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Sleep Tracking
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Hours Slept
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {sleepData[sleepData.length - 1].hours} hours
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleepData[sleepData.length - 1].hours}
                onChange={(e) => {
                  const newSleepData = [...sleepData];
                  newSleepData[newSleepData.length - 1].hours =
                    Number.parseFloat(e.target.value);
                  // This would update the state in a real app
                }}
                className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Sleep Quality
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {sleepData[sleepData.length - 1].quality}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sleepData[sleepData.length - 1].quality}
                onChange={(e) => {
                  const newSleepData = [...sleepData];
                  newSleepData[newSleepData.length - 1].quality =
                    Number.parseInt(e.target.value);
                  // This would update the state in a real app
                }}
                className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Water Intake
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#118AB2"
                  strokeWidth="10"
                  strokeDasharray={`${
                    (waterData[waterData.length - 1].amount /
                      waterData[waterData.length - 1].target) *
                    283
                  } 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {Math.round(
                    (waterData[waterData.length - 1].amount /
                      waterData[waterData.length - 1].target) *
                      100
                  )}
                  %
                </span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  of daily goal
                </span>
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {waterData[waterData.length - 1].amount} ml
                </span>
                <span
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {waterData[waterData.length - 1].target} ml
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={waterData[waterData.length - 1].target * 1.5}
                value={waterData[waterData.length - 1].amount}
                onChange={(e) => {
                  // This would update the state in a real app
                }}
                className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => {
                  // This would update the state in a real app
                  displayNotification("Added 250ml of water!");
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
              >
                +250ml
              </button>
              <button
                onClick={() => {
                  // This would update the state in a real app
                  displayNotification("Added 500ml of water!");
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>

        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Screen Time
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Today's Screen Time
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {screenTimeData[screenTimeData.length - 1].hours} hours
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={screenTimeData[screenTimeData.length - 1].hours}
                onChange={(e) => {
                  // This would update the state in a real app
                }}
                className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <p
                className={`text-sm mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Set Daily Limit
              </p>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  2h
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  4h
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  6h
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  8h
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AddHabitModal = () => (
    <AnimatePresence>
      {showAddHabit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`w-full max-w-md rounded-lg shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Add New Habit
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="e.g., Meditation"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Icon
                  </label>
                  <select
                    value={newHabit.icon}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, icon: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="🏃‍♂️">🏃‍♂️ Exercise</option>
                    <option value="🧘‍♂️">🧘‍♂️ Meditation</option>
                    <option value="📚">📚 Reading</option>
                    <option value="💧">💧 Water</option>
                    <option value="✏️">✏️ Journal</option>
                    <option value="🎯">🎯 Goal</option>
                    <option value="💊">💊 Medicine</option>
                    <option value="🥗">🥗 Healthy Eating</option>
                  </select>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Color
                  </label>
                  <select
                    value={newHabit.color}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, color: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="#FF6B6B">Red</option>
                    <option value="#4ECDC4">Teal</option>
                    <option value="#FFD166">Yellow</option>
                    <option value="#118AB2">Blue</option>
                    <option value="#6A0572">Purple</option>
                    <option value="#52B788">Green</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Target
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newHabit.target}
                    onChange={(e) =>
                      setNewHabit({
                        ...newHabit,
                        target: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newHabit.unit}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, unit: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g., minutes, pages"
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Frequency
                </label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) =>
                    setNewHabit({
                      ...newHabit,
                      frequency: e.target.value as "daily" | "weekly",
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddHabit(false)}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddHabit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Habit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const HabitDetailModal = () => (
    <AnimatePresence>
      {showHabitDetail && selectedHabit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`w-full max-w-md rounded-lg shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">{selectedHabit.icon}</span>
                <h3
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {selectedHabit.name}
                </h3>
              </div>
              <button
                onClick={() => setShowHabitDetail(false)}
                className={`p-1 rounded-full ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Today's Progress
                  </span>
                  <span
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {selectedHabit.progress} / {selectedHabit.target}{" "}
                    {selectedHabit.unit}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${calculateCompletion(selectedHabit)}%`,
                      backgroundColor: selectedHabit.color,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Current Streak
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {selectedHabit.streak} days
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Completion Rate
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {Math.round(
                      (selectedHabit.history.filter(
                        (day) => day.value >= selectedHabit.target
                      ).length /
                        selectedHabit.history.length) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>

              <div>
                <h4
                  className={`text-lg font-medium mb-3 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Weekly Progress
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedHabit.history.slice(-7)}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        stroke={darkMode ? "#9ca3af" : "#6b7280"}
                      />
                      <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "#fff",
                          borderColor: darkMode ? "#374151" : "#e5e7eb",
                          color: darkMode ? "#fff" : "#000",
                        }}
                        formatter={(value) => [
                          `${value} ${selectedHabit.unit}`,
                          selectedHabit.name,
                        ]}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Bar dataKey="value" fill={selectedHabit.color} />
                      <ReferenceLine
                        y={selectedHabit.target}
                        stroke="#FF6B6B"
                        strokeDasharray="3 3"
                        label={{
                          value: "Target",
                          fill: darkMode ? "#fff" : "#000",
                          position: "insideTopRight",
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleDeleteHabit(selectedHabit.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Habit
                </button>
                <button
                  onClick={() => {
                    handleUpdateProgress(
                      selectedHabit.id,
                      selectedHabit.target
                    );
                    setShowHabitDetail(false);
                    displayNotification(
                      `Marked "${selectedHabit.name}" as completed!`
                    );
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Notification = () => (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`px-4 py-2 rounded-lg shadow-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            {notificationMessage}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Footer = () => (
    <footer
      className={`mt-auto py-6 ${
        darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-600"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl">📊</span>
            <span className="font-bold">HabitTrack</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-indigo-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-500 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-indigo-500 transition-colors">
              Help
            </a>
          </div>
          <div className="mt-4 md:mt-0 text-sm">
            &copy; {new Date().getFullYear()} HabitTrack. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Head>
        <title>HabitTrack - Personal Analytics & Habit Tracker</title>
        <meta
          name="description"
          content="Track your daily habits and personal stats"
        />
      </Head>
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "check-in" && <CheckIn />}
      </main>
      <Footer />
      <AddHabitModal />
      <HabitDetailModal />
      <Notification />
    </div>
  );
}
