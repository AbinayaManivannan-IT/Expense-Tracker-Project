const express = require('express')
const {getBudgetHandler} = require('../controllers/budget')

const route = express.Router();

route
.get('/',getBudgetHandler);

module.exports = route;