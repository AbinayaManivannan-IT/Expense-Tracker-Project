const express = require('express');
const {getUserDataHandler,createNewUserHandler,userLoginHandler,editUserProfileHandler} = require('../controllers/users');

const route = express.Router();

route
.get('/',getUserDataHandler)
.post('/',createNewUserHandler)
.post('/login',userLoginHandler)
.patch('/',editUserProfileHandler);

module.exports = route;