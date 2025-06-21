const mongoose = require('mongoose');
const budgetSchema = mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  budget:{
    type:Number,  //fixed based on the salary does not change
    required:true,
  },
  dailyLt:{
    type:Number,
    required:true,
  },
  savingsAmt:{
    type:Number,
    required:true,
  },
  remainingAmt:{
    type:Number,
    required:true,
  },
  remainingDays:{
    type:Number,
    required:true,
  },
  resetDate:{
    type:Date,
    required:true,
  }
},{timestamps:true});

const Budget = mongoose.model('budget',budgetSchema);

module.exports = Budget;