const Budget = require('../models/budget')

async function createBudgetHandler(req, res){
    const body = req.body;
    const salary = body.salary;
    const savingsAmt = (body.savings * salary)/100;
    
}

async function getBudgetHandler(req,res){
    const body = req.body;
    const query = req.query;
    const result = await Budget.findOne({email:query.email});
    return res.status(200).json(result);
}

module.exports = {getBudgetHandler}