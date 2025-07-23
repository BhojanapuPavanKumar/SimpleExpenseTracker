import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";
import { useAppContext } from "../contexts/appContext";

const ExpenseList = () => {
  const {setAppLoading}=useAppContext();
  const [expenseData, setExpenseData] = useState([]);

  const fetchExpenses = async () => {
    setAppLoading(true);
    try {
      const res = await axiosInstance.get("/expense/get");
      setExpenseData(res.data.data || []);
    } catch (err) {
      ErrorToast(`Failed to fetch expenses: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchExpenses();
    setAppLoading(false);
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent tracking-wide drop-shadow-lg">
        Expense History
      </h2>

      {expenseData.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No expense records found.
        </p>
      ) : (
        <ul className="space-y-4">
          {expenseData.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-red-200 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
            >
              <div>
                <p className="font-semibold text-gray-800 text-lg">{item.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </p>
                {item.category && (
                  <span className="text-xs font-medium text-white bg-red-400 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="text-xl font-bold text-red-600">
                ₹{item.amount}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { ExpenseList };
