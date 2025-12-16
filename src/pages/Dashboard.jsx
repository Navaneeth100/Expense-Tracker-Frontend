import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { url } from "../../mainurl";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access");

  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    total_balance: 0,
    graph_data: [],
    highest_category: null
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${url}/api/expense-summary/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Chart Data
  const chartData = {
    labels: summary.graph_data?.map((item) => item.category),
    datasets: [
      {
        label: "Expense by Category",
        data: summary.graph_data?.map((item) => item.total),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container px-4 py-8">

      {/* Welcome message */}

      <h1 className="text-3xl font-bold text-blue-800">
        Welcome, {user?.username} 👋
      </h1>
      <p className="text-gray-600 mt-2">Here is your financial overview.</p>

      {/* Summary Cards */}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-white border shadow-sm p-6 rounded-xl">
          <p className="text-gray-500 text-sm">Total Income</p>
          <p className="text-3xl font-bold text-green-600">₹{summary.total_income}</p>
        </div>

        <div className="bg-white border shadow-sm p-6 rounded-xl">
          <p className="text-gray-500 text-sm">Total Expense</p>
          <p className="text-3xl font-bold text-red-600">₹{summary.total_expense}</p>
        </div>

        <div className="bg-white border shadow-sm p-6 rounded-xl">
          <p className="text-gray-500 text-sm">Total Balance</p>
          <p className="text-3xl font-bold text-blue-700">₹{summary.total_balance}</p>
        </div>

      </div>

      {/* Bar Chart */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="mt-8 bg-white border shadow-sm p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Expense Breakdown by Category
          </h2>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>


        <div className="flex flex-col gap-6 mt-8">

          <div className="bg-white border shadow-sm p-6 rounded-xl">
            <p className="text-gray-500 text-sm">Highest Expense Category</p>
            <p className="text-xl font-bold text-red-600 mt-1">
              {summary?.highest_category?.category || "-"}
            </p>
            <p className="text-gray-600 font-semibold">
              ₹{summary?.highest_category?.total || 0}
            </p>
          </div>

          <div className="bg-white border shadow-sm p-6 rounded-xl">
            <p className="text-gray-500 text-sm">Lowest Expense Category</p>
            <p className="text-xl font-bold text-green-600 mt-1">
              {summary?.lowest_category?.category || "-"}
            </p>
            <p className="text-gray-600 font-semibold">
              ₹{summary?.lowest_category?.total || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
