const { IncomeModel } = require("../../../models/incomeSchema");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

const getAllIncomeController = async (req, res) => {
  try {
    const userId = req.user._id;

    const incomeData = await IncomeModel.find({ user: userId }).sort({
      date: -1,
    });

    if (incomeData.length === 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "No data is available",
        data: [],
      });
    }

    res.status(200).json({
      isSuccess: true,
      data: incomeData,
    });
  } catch (error) {
    console.log("Get all Income failed:", error.message);
    handleGenericAPIError("getAllIncomeController", req, res, error);
  }
};

const addIncomeController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, amount, note, date } = req.body;

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
        message: "Amount must be a valid or positive number.",
      });
    }

    const newIncome = new IncomeModel({
      title,
      amount: Number(amount),
      user: userId,
      date: date,
      note: note,
    });

    await newIncome.save();

    res.status(201).json({
      isSuccess: true,
      message: "Income added successfully!",
      data: newIncome,
    });
  } catch (error) {
    handleGenericAPIError("addIncomeController", req, res, error);
  }
};

module.exports = { getAllIncomeController, addIncomeController };
