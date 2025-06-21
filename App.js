const express = require("express");
const app = express();

app.get("/",(req,res)=>{
  res.send(`Hello ${req.query.name}`);
});
app.get("/about",(req,res)=>{
  res.send("Hey what do you want?")
});

app.listen(8000, ()=> console.log("The port 8000 has been started"))