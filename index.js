const express = require("express")
const {connectMongo} = require('./config/db')
const userRouter = require('./routes/users');
const expenseRouter = require('./routes/expenses');
const budgetRouter = require('./routes/budgets');
const app = express();
const PORT = 8000;

connectMongo('mongodb://localhost:27017/trackerdb')
.then(()=>console.log("Mongo DB successfully connected"))
.catch((err)=>console.log(`Error from Mongo DB: ${err}`));


app.listen(PORT,()=>console.log(`sever has been started at port : ${PORT}`));
app.use(express.urlencoded({extended: false})); 
app.use(express.json());
app.use('/users',userRouter);
app.use('/expenses',expenseRouter);
app.use('/budget',budgetRouter);
