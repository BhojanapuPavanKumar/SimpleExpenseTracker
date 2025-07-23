import { useState } from "react";
import { AddExpense } from "../components/AddExpense";
import { ExpenseList } from "../components/ExpenseList";
import { Navbar } from "../components/navbar";

const Expense = () => {
  const [activeTab, setActiveTab] = useState("add"); 

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
        <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <div className="flex justify-center mb-6 gap-4">
            <button
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "add"
                  ? "bg-gradient-to-r from-red-400 to-orange-500 text-white shadow-lg"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
              onClick={() => setActiveTab("add")}
            >
              ➕ Add Expense
            </button>

            <button
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "list"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
              onClick={() => setActiveTab("list")}
            >
              📋 Show History
            </button>
          </div>

          <div className="mt-4">
            {activeTab === "add" ? <AddExpense /> : <ExpenseList />}
          </div>
        </div>
      </div>
    </>
  );
};

export { Expense };
