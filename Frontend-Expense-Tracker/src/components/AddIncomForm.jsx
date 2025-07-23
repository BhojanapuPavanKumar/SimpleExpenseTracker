import { useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { SuccessToast, ErrorToast } from "../utils/toastHelper";
import { useAppContext } from "../contexts/appContext";

const AddIncomeForm = ({ onIncomeAdded }) => {
  const {setAppLoading}=useAppContext();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    note: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setAppLoading(true);
    e.preventDefault();

    if (!form.title || !form.amount || !form.date) {
      return ErrorToast("All fields are required");
    }

    try {
      const res = await axiosInstance.post("/income/add", form);
      SuccessToast(res.data.message);
      setForm({ title: "", amount: "", note: "", date: "" });
      if (onIncomeAdded) onIncomeAdded();
      setAppLoading(false);
    } catch (err) {
      ErrorToast(err.response?.data?.message || "Failed to add income");
       setAppLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 space-y-4 border border-gray-200"
    >
      <h2 className="text-2xl font-extrabold text-blue-600 bg-gradient-to-r from-emerald-500 to-indigo-500 bg-clip-text text-transparent">
        Add New Income
      </h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Income Title"
        className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
      />

      <input
        name="amount"
        value={form.amount}
        onChange={handleChange}
        type="number"
        placeholder="Amount (₹)"
        className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
      />

      <input
        name="date"
        value={form.date}
        onChange={handleChange}
        type="date"
        className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
      />

      <textarea
        name="note"
        value={form.note}
        onChange={handleChange}
        placeholder="Note (optional)"
        className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
      />

      <button
        type="submit"
        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
      >
        Add Income
      </button>
    </form>
  );
};

export default AddIncomeForm;
