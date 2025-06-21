const User = require('../models/users')
const Budget = require('../models/budget')
const {calculateRemainingDays,getNextResetDate} = require('../otherLogic')
async function getUserDataHandler(req,res){
  const query = req.query;
  const user = await User.find({email:query.email});
  if(!user){
    console.log('[info:user-controller] user not found');
    return res.status(404).json({status:'user not found'});
  }
  return res.json(user);
}

async function createNewUserHandler(req,res){
  const body = req.body;
  const savingsAmt =  await (body.salary * body.savings)/100;
  const userObj =  await User.create({
    name:body.name,
    email:body.email,
    password:body.password,
    salary:body.salary,
    savings:savingsAmt,
    fixedExpenses:body.fixedExpenses,
    salaryCreditDate:body.salaryCreditDate,
  });

  const budgetRes = await User.aggregate([
    {$match: {email:body.email}},
    {$unwind:"$fixedExpenses"},
    {$project:{
      value:{$first:{$objectToArray:"$fixedExpenses"}}
    }},
    {$group:{_id:null, totExp:{$sum:{ $sum: "$value.v" }}}}
  ])

  const expenseAmt =  budgetRes[0].totExp ;

  console.log("expense amt: "+expenseAmt);
  
  const iniBudAmt = body.salary - (expenseAmt + savingsAmt);
  const remainingDays = calculateRemainingDays(body.salaryCreditDate);
  const userPrompt = Number(req.query.currentAmount);
  console.log("User entered Amount: "+userPrompt);
  const amount = isNaN(userPrompt)? iniBudAmt : (userPrompt -savingsAmt) ;


  const resetDate = getNextResetDate(body.salaryCreditDate);
  const budgetObj = await Budget.create({
    email: body.email,
    budget: iniBudAmt,
    dailyLt: amount/remainingDays,
    savingsAmt:savingsAmt,
    remainingAmt: amount,
    remainingDays: remainingDays,
    resetDate:resetDate
  })

  console.log(userObj);
  console.log(budgetObj);
  
  return res.status(201).json({status:'success',id:userObj._id});
}
async function userLoginHandler(req,res){
  const {email,password} = req.body;
  const userObj = await User.findOne({email});
  console.log(email);
  if(!userObj){
    res.status(401).json({status:'this email does not exist'});
  }
  else{
  console.log(password+" "+userObj.password);
  if(password === userObj.password) {
    const remainingDays = await calculateRemainingDays(userObj.salaryCreditDate);
    await Budget.updateOne({email: email},{$set:{remainingDays:remainingDays}});
    const budgetObj = await Budget.findOne({email:email});
    const updatedDailyLt = await (budgetObj.remainingAmt/remainingDays);
    await Budget.updateOne({email:email},{$set:{dailyLt:updatedDailyLt}});
    console.log(updatedDailyLt);
    console.log(remainingDays);
    res.status(200).json({status:'login successful'});
  }
  else res.status(401).json({status:'wrong password'});
  }
}

async function editUserProfileHandler(req,res){
  body = req.body;
  const user = await User.updateOne({email:body.email},{$set:{...body}});
  res.status(200).json({status:"successfully updated",user:user});
}
module.exports = {getUserDataHandler,createNewUserHandler,userLoginHandler,editUserProfileHandler,};