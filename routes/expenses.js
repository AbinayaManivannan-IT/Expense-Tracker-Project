const express = require('express');
const route = express.Router();
const {AddNewExpenseHandler,EditExpenseHandler,filterExpensesHandler, deleteExpenseHandler} = require('../controllers/expenses');
route
.post('/',AddNewExpenseHandler)
.patch('/',EditExpenseHandler)
.get('/',filterExpensesHandler)
.delete('/',deleteExpenseHandler);

module.exports = route;