import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";

const ExpenseList = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/expense/get");
      setExpenseData(res.data.data || []);
    } catch (err) {
      ErrorToast(`Failed to fetch expenses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/expense/delete/${id}`);
      SuccessToast("Expense deleted successfully!");
      fetchExpenses();
    } catch (err) {
      ErrorToast(`Delete failed: ${err.message}`);
    }
  };

  const startEditing = (expense) => {
    setEditingId(expense._id);
    setEditForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category || "",
      date: expense.date?.split("T")[0] || "",
      note: expense.note || "",
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axiosInstance.patch(`/expense/update/${id}`, editForm);
      SuccessToast("Expense updated!");
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      ErrorToast(`Update failed: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent tracking-wide drop-shadow-lg">
        Expense History
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 italic">
          Data is loading, please wait (it may take up to 2 minutes)...
        </p>
      ) : expenseData.length === 0 ? (
        <p className="text-center text-gray-500 italic">No expense records found.</p>
      ) : (
        <ul className="space-y-4">
          {expenseData.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-red-200 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
            >
              {editingId === item._id ? (
                <div className="w-full flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount</label>
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Note</label>
                    <textarea
                      rows="2"
                      value={editForm.note}
                      onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => handleEditSubmit(item._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    {item.category && (
                      <span className="text-xs font-medium text-white bg-red-400 px-2 py-1 rounded-full inline-block mt-1">
                        {item.category}
                      </span>
                    )}
                    {item.note && (
                      <p className="text-sm text-gray-600 italic mt-1">📝 {item.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">₹{item.amount}</p>
                    <div className="flex gap-2 justify-end mt-2">
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

export { ExpenseList };
