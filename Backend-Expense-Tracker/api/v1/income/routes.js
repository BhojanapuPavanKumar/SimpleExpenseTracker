const express = require("express");
const { addIncomeController, getAllIncomeController } = require("./controller");
const { userAuthenticationMiddleware } = require("../middleware");

const incomeRouter = express.Router();

// /api/v1/auth/...
incomeRouter.get("/get", userAuthenticationMiddleware, getAllIncomeController);
incomeRouter.post("/add", userAuthenticationMiddleware, addIncomeController);

module.exports = { incomeRouter };
