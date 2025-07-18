const { ExpenseModel } = require("../../../models/expenseSchema");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

const getAllExpenseController = async (req, res) => {
  try {
    const userId = req.user._id;

    const expenses = await ExpenseModel.find({ user: userId }).sort({
      date: -1,
    });

    if (expenses.length === 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "No data is available",
        data: [],
      });
    }

    res.status(200).json({
      isSuccess: true,
      data: expenses,
    });
  } catch (error) {
    console.log("Get all expenses failed:", error.message);
    handleGenericAPIError("getAllExpenseController", req, res, error);
  }
};

const addExpenseController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, amount, category } = req.body;

    // Basic validation
    if (!title || amount === undefined) {
      return res.status(400).json({
        isSuccess: false,
        message: "Title and amount are required.",
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Amount must be a valid positive number.",
      });
    }

    const newExpense = new ExpenseModel({
      title,
      amount: Number(amount),
      category,
      user: userId,
    });

    await newExpense.save();

    res.status(201).json({
      isSuccess: true,
      message: "Expense added successfully!",
      data: newExpense,
    });
  } catch (error) {
    handleGenericAPIError("addExpenseController", req, res, error);
  }
};

module.exports = { getAllExpenseController, addExpenseController };
