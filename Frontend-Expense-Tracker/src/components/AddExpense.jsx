import { useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { SuccessToast, ErrorToast } from "../utils/toastHelper";
import { useNavigate } from "react-router";
import { useAppContext } from "../contexts/appContext";

const AddExpense = () => {
    const navigate=useNavigate();
    const { setAppLoading}=useAppContext();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
     setAppLoading(true);
    e.preventDefault();
    if (!title || !amount || !category || !date) {
      setAppLoading(false);
      ErrorToast("All fields are required");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/v1/expense/add", {
        title,
        amount,
        category,
        date,
      });

      if (res.data.isSuccess) {
         setAppLoading(false);
        SuccessToast("Expense Added Successfully");
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");
        navigate("/");
      }
    } catch (err) {
       setAppLoading(false);
      ErrorToast(err?.response?.data?.message || err.message);
    }
  };

   return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl text-gray-800">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-700">
        Add New Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow"
        />

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-blue-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow"
        >
          <option value="">Select Category</option>
          <option value="grocery">Grocery</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="utilities">Utilities</option>
          <option value="entertainment">Entertainment</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow"
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:scale-105"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export { AddExpense };
