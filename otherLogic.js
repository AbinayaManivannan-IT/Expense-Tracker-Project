//salaryCreditDate - Number
const Expenses = require("./models/expenses")
const Budget = require("./models/budget")
const User = require("./models/users")
//signUp handler
function calculateRemainingDays(salaryCreditDate){
  const currentDate = new Date();
  const curDate =  currentDate.getDate();
  const curMonth =  currentDate.getMonth();
  const curYear =  currentDate.getFullYear();

  if(curDate < salaryCreditDate){
    nextSalaryDate = new Date(curYear, curMonth, salaryCreditDate);
  }
  else{
    nextSalaryDate = new Date(curYear, curMonth+1, salaryCreditDate);
  }

  const diffTime =  nextSalaryDate.getTime() - currentDate.getTime();
  const remainingDays =  Math.ceil(diffTime/(1000*60*60*24));

  return remainingDays;
}

//for login handler
function resetRemainingAmt(User,Budget){
  const today = new Date();
  const creditDate = new Date(today.getFullYear(), today.getMonth(), User.salaryCreditDate);

  if(today.toDateString() === creditDate.toDateString()){
    Budget.remainingAmt = User.salary;
  }

  Budget.save();
}

//signUp handler
function getNextResetDate(salaryCreditDate){
  const today = new Date();
  const thisMonthCreditDate = new Date(today.getFullYear(), today.getMonth(), salaryCreditDate);

  if(today > thisMonthCreditDate){
    return new Date(today.getFullYear(), today.getMonth()+1, salaryCreditDate);
  }

  return thisMonthCreditDate;
}

//update budget 
async function updateBudget(email) {
  const today = new Date();
  
  const budgetObj = await Budget.findOne({ email });
  const userObj = await User.findOne({ email });
  const expObj = await Expenses.findOne({name:"hello"});
  console.log(email);
  console.log(budgetObj);
  console.log(today+"******"+expObj.date);
  const result = await Expenses.aggregate([
    {
      $match: {
        email: email,
        $expr: {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$date" } } },
            { $dateToString: { format: "%Y-%m-%d", date: today } }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        totExp: { $sum: "$amount" }
      }
    }
  ]);

  const todayExp = result.length > 0 ? result[0].totExp : 0;

  const overspent = todayExp > budgetObj.dailyLt;
  let updatedFields = {};

  console.log("Before Expense: ",budgetObj.remainingAmt);
  if (budgetObj.remainingAmt !== 0) {
    const remainingAmt = budgetObj.remainingAmt - todayExp;
    updatedFields.remainingAmt = remainingAmt;
  } else {
    const savingsAmt = budgetObj.savingsAmt - todayExp;
    updatedFields.savingsAmt = savingsAmt;
  }

  if (overspent) {
    const remainingDays = calculateRemainingDays(userObj.salaryCreditDate);
    const remainingAmt = updatedFields.remainingAmt || budgetObj.remainingAmt;
    const newLt = remainingAmt / remainingDays;
    updatedFields.dailyLt = newLt;
    console.log("After Expense"+remainingAmt)
  }

  await Budget.updateOne({ email }, { $set: updatedFields });
  
  console.log(updatedFields);
  return { status: overspent ? "overspent" : "okay", dailyLt: budgetObj.dailyLt, todayExp: todayExp };
}

module.exports = {calculateRemainingDays,resetRemainingAmt,getNextResetDate,updateBudget}