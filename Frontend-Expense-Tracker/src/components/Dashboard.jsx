import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { groupByMonth, groupByYear } from "../utils/groupExpense";
import { ErrorToast } from "../utils/toastHelper";
import CircularProgressBar from "../components/CircularProgressBar";
import { useAppContext } from "../contexts/appContext";

const Dashboard = () => {
  const { setAppLoading } = useAppContext();

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [filter, setFilter] = useState("day");

  const fetchExpenses = async () => {
    setAppLoading(true);
    try {
      const res = await axiosInstance.get("/expense/get");
      setExpenses(res.data.data || []);
    } catch (err) {
      ErrorToast(`Failed to fetch expenses: ${err.message}`);
    }
  };

  const fetchIncome = async () => {
    setAppLoading(true);
    try {
      const res = await axiosInstance.get("/income/get");
      setIncome(res.data.data || []);
    } catch (err) {
      ErrorToast(`Failed to fetch income: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
    setAppLoading(false);
  }, []);

  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalIncome = income.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const overspentAmount = totalExpense > totalIncome ? totalExpense - totalIncome : 0;
  const isOverspending = overspentAmount > 0;

  const spentPercentage = totalIncome
    ? Math.min(100, Math.round((totalExpense / totalIncome) * 100))
    : totalExpense > 0
    ? 100
    : 0;

  const balancePercentage = totalIncome ? Math.max(0, 100 - spentPercentage) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">
          Expense Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Income</h3>
            <p className="text-2xl text-green-600 font-bold">₹{totalIncome}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Expense</h3>
            <p
              className={`text-2xl font-bold ${
                totalExpense > totalIncome ? "text-red-800" : "text-red-500"
              }`}
            >
              ₹{totalExpense}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <CircularProgressBar
              percentage={spentPercentage}
              color="#f87171"
              label={isOverspending ? `-₹${overspentAmount}` : "Spent"}
            />
            <CircularProgressBar
              percentage={balancePercentage}
              color="#34d399"
              label={isOverspending ? "₹0" : "Remaining"}
            />
          </div>
        </div>

        {isOverspending && (
          <p className="text-center text-red-700 font-medium mb-4">
            ⚠ You are overspending by ₹{overspentAmount}
          </p>
        )}

        <div className="mb-6 flex justify-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="day">Day-wise</option>
            <option value="month">Month-wise</option>
            <option value="year">Year-wise</option>
          </select>
        </div>

        {filter === "day" && expenses.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-md space-y-4">
            {expenses.map((item) => (
              <div
                key={item._id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-lg">{item.title}</span>
                  <span className="font-bold text-red-600">₹{item.amount}</span>
                </div>
                <p className="text-sm text-gray-600">{item.category}</p>
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
        )}

        {filter === "month" &&
          Object.entries(groupByMonth(expenses)).map(([month, items]) => (
            <div
              key={month}
              className="mb-6 border-2 border-blue-300 bg-blue-50 rounded-xl shadow-sm p-4"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-3 underline underline-offset-4">
                {month}
              </h3>
              <div className="grid gap-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-white border rounded-lg shadow-md"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-green-600 font-semibold">₹{item.amount}</span>
                    </div>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-xs text-gray-400">
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
          ))}

        {filter === "year" &&
          Object.entries(groupByYear(expenses)).map(([year, months]) => (
            <div
              key={year}
              className="mb-8 border-2 border-green-300 bg-green-50 rounded-2xl p-5 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-green-700 mb-4 border-b pb-2">
                {year}
              </h2>
              {Object.entries(months).map(([month, items]) => (
                <div
                  key={month}
                  className="mb-6 bg-white border border-indigo-200 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold text-indigo-700 mb-3 underline">
                    {month}
                  </h3>
                  <div className="grid gap-4">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-red-600 font-semibold">₹{item.amount}</span>
                        </div>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-xs text-gray-400">
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
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export { Dashboard };
