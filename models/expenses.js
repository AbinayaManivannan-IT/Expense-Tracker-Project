const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  
  email:{
    type:String,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    default:'others',
  },
  amount:{
    type:Number,
    required:true,
  },
  description:{
    type:String,
    default:'',
  },
  date:{
    type:Date,
    required:true,
  }
},{timestamps:true});

const Expenses = mongoose.model('expenses',expenseSchema);
module.exports = Expenses;