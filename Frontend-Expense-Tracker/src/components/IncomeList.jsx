import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";

const IncomeList = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    date: "",
    note: "",
  });

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/income/get");
      setIncomeData(res.data.data || []);
    } catch (err) {
      ErrorToast(`Failed to fetch income records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (item) => {
    setEditingId(item._id);
    setEditForm({
      title: item.title || "",
      amount: item.amount || "",
      date: item.date?.slice(0, 10) || "",
      note: item.note || "",
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axiosInstance.patch(`/api/v1/income/update/${id}`, editForm);
      SuccessToast("Income updated successfully!");
      setEditingId(null);
      fetchIncome();
    } catch (err) {
      ErrorToast(`Update failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/income/delete/${id}`);
      SuccessToast("Income record deleted.");
      fetchIncome();
    } catch (err) {
      ErrorToast(`Delete failed: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  return (
    <div className="w-full mt-10">
      <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
        Income History
      </h2>

      {loading ? (
        <p className="text-center text-gray-400 italic">Please wait, data is loading...</p>
      ) : incomeData.length === 0 ? (
        <p className="text-center text-gray-500 italic">No income records found.</p>
      ) : (
        <ul className="space-y-6 max-w-3xl mx-auto">
          {incomeData.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center gap-6 p-6 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
            >
              {editingId === item._id ? (
                <div className="w-full flex flex-col gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Title
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="mt-1 w-full px-3 py-1 border rounded-md"
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Amount
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      className="mt-1 w-full px-3 py-1 border rounded-md"
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Date
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="mt-1 w-full px-3 py-1 border rounded-md"
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Note
                    <textarea
                      value={editForm.note}
                      onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                      className="mt-1 w-full px-3 py-1 border rounded-md"
                      rows={2}
                    />
                  </label>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditSubmit(item._id)}
                      className="px-4 py-1 bg-green-500 text-white rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1 bg-gray-400 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                    {item.note && (
                      <p className="text-xs italic text-gray-700 mt-1">{item.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">₹{item.amount}</p>
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => startEditing(item)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { IncomeList };
