const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  salary:{
    type:Number,
    default:0,
  },
  savings:{
    type:Number,
    default:0,
  },
  fixedExpenses:{
    type: mongoose.Schema.Types.Mixed,
    default:[]
  },
  salaryCreditDate:{
    type:Number,
    required:true,
  }

},{timestamps:true});

const User = mongoose.model('users',userSchema);
module.exports = User;