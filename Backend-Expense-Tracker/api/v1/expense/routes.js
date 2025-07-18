const express = require("express");
const {
  addExpenseController,
  getAllExpenseController,
} = require("./controller");
const { userAuthenticationMiddleware } = require("../middleware");

const expenseRouter = express.Router();

// /api/v1/auth/...
expenseRouter.get("/", userAuthenticationMiddleware, getAllExpenseController);
expenseRouter.post("/", userAuthenticationMiddleware, addExpenseController);

module.exports = { expenseRouter };
