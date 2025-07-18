import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";
import { useNavigate } from "react-router";
import { Navbar } from "./navbar";
import CircularProgressBar from "../components/CircularProgressBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("day");
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userBudget, setUserBudget] = useState(10000); // Default budget, user can update

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/expense");
      console.log("res while fetching", res);
      if (res.data.isSuccess && res.data.data.length) {
        setExpenses(res.data.data);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.message || err.message || "Failed to fetch expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter]);

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  const spentPercentage = userBudget
    ? Math.min(100, Math.round((totalAmount / userBudget) * 100))
    : 0;

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-4">Dashboard</h2>

        {/* Budget Input */}
        <div className="flex justify-center gap-2 mb-6">
          <label htmlFor="budget" className="font-medium mt-2 text-gray-700">
            Your Budget (₹):
          </label>
          <input
            id="budget"
            type="number"
            className="border px-4 py-2 rounded-md w-40 text-right shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={userBudget}
            onChange={(e) => setUserBudget(Number(e.target.value))}
            min="0"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["day", "month", "year"].map((item) => (
            <button
              key={item}
              className={`px-4 py-2 rounded-md border transition-all shadow-md ${
                filter === item
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-white text-blue-600 border-blue-600 hover:bg-blue-100"
              }`}
              onClick={() => setFilter(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {/* Circular Progress Bar */}
        <div className="flex justify-center gap-6 flex-wrap mb-6">
          <CircularProgressBar percentage={spentPercentage} color="#f97316" label="Budget Used" />
          <CircularProgressBar percentage={100 - spentPercentage} color="#10b981" label="Remaining" />
        </div>

        {/* Data Section */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : expenses.length === 0 ? (
          <div className="text-center text-gray-600 italic">
            <p>No expense data available for this {filter}.</p>
            <p className="mt-2">Start your expense tracking today!</p>
            <button
              onClick={() => navigate("/add-expense")}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
            >
              Add Item / Grocery
            </button>
          </div>
        ) : (
          <div>
            {/* Summary */}
            <div className="flex justify-between items-center bg-blue-100 rounded-md p-4 mb-6 shadow-inner">
              <p className="text-lg font-semibold">Total Spent: ₹{totalAmount}</p>
              <p className="text-sm text-blue-800 italic">
                Showing {expenses.length} {filter} record{expenses.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Expense List */}
            <div className="space-y-3">
              {expenses.map((item) => (
                <div
                  key={item._id}
                  className="p-4 border rounded-md shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className="text-blue-600 font-bold">₹{item.amount}</span>
                  </div>
                  <p className="text-sm text-gray-600">Category: {item.category}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Expense Button */}
        <div className="sticky bottom-6 flex justify-center mt-10">
          <button
            onClick={() => navigate("/add-expense")}
            className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            ➕ Add New Expense
          </button>
        </div>
      </div>
    </>
  );
};

export { Dashboard };
