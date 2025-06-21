const Expenses = require('../models/expenses');
const Budget = require('../models/budget');
const {updateBudget} = require('../otherLogic');

async function AddNewExpenseHandler(req,res){
  const body = req.body;
  await Expenses.insertOne(body,{ordered:false});
  const result = await updateBudget(body.email);
  console.log(result);
  return res.status(201).json({status:result.status,email:body.email});
}

// /expenses?_id=680da2d913996330bb8de08a
async function EditExpenseHandler(req,res){
  const _id = req.query._id;
  const updates = req.body;
  console.log("Updates "+updates,"_id: "+_id);
  const expObj = await Expenses.findOne({_id:_id}); 
  console.log(await Expenses.updateOne({_id:_id},{$set:{...updates}}));
  console.log(await Expenses.find({_id}));
  return res.status(200).json({status:'successfully updated'});

}
async function deleteExpenseHandler(req,res){
  const _id = req.query._id;
  const delres = await Expenses.deleteOne({_id:_id});
  console.log(delres);
  return res.status(200).json({status:'successfully deleted'});
}
async function filterExpensesHandler(req,res){
  const query = req.query;
  const filter = {};
  filter.email = query.email;
  if(query.category){
    filter.category = query.category;
  }
  if(query.startDate && query.endDate){

    filter.date = {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate)
    }

  }

  if(query.minAmt && query.maxAmt){
    filter.amount = {
      $gte : Number(query.minAmt),
      $lte : Number(query.maxAmt)
    }
  }
  if(query.totExp){
    const result = await Expenses.aggregate([{$match:{email:query.email}},{$group:{_id:null,tot:{$sum:"$amount"}}}]) 

    const totalExpenses = result.length>0?result[0].tot:0;
    const savings = await Budget.findOne(filter);
    console.log(filter,savings);
    return res.status(200).json({totalExp:totalExpenses,savings:savings.savingsAmt, dailyLt: savings.dailyLt.toFixed(3)}); 

  }
  try{
    const results = await Expenses.find(filter);
    return res.status(200).json({results});
  }
  catch(err){
    return res.status(500).json({status: 'error',msg: err.message});
  }

  
}

module.exports = {AddNewExpenseHandler,EditExpenseHandler,filterExpensesHandler,deleteExpenseHandler}