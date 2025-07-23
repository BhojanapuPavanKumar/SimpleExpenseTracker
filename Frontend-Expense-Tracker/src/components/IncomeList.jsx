import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";
import { useAppContext } from "../contexts/appContext";

const IncomeList = () => {
  const {setAppLoading}=useAppContext();
  const [incomeData, setIncomeData] = useState([]);

  const fetchIncome = async () => {
    setAppLoading(true);
    try {
      const res = await axiosInstance.get("/income/get");
      setIncomeData(res.data.data || []);
    } catch (err) {
      ErrorToast(`Failed to fetch income records ${err.message}`);
    }
  };

  useEffect(() => {
    fetchIncome();
    setAppLoading(false);
  }, []);

  return (
    <div className="w-full mt-10">
      <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
        Income History
      </h2>

      {incomeData.length === 0 ? (
        <p className="text-center text-gray-500 italic">No income records found.</p>
      ) : (
        <ul className="space-y-6 max-w-3xl mx-auto">
          {incomeData.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center gap-6 p-6 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
            >
              <div>
                <p className="text-xl font-semibold text-gray-900 drop-shadow-sm">{item.title}</p>
                <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                {item.note && (
                  <p className="text-xs italic text-gray-700 mt-1">{item.note}</p>
                )}
              </div>
              <div className="text-2xl font-bold text-green-500 drop-shadow-md">
                ₹{item.amount}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { IncomeList };
