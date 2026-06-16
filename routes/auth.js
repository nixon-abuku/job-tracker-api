//// WHAT IT DOES:The user creates username and password the password gets hashed and stored in the database 
// INPUTS: req.body.username, req.body.password
// OUTPUTS: username and Hashed password in database and JSON message 201status code confirming account created
// STEPS:
// 1.Validate the username and the password
// 2.Hash the password with bcrypt
// 3.Store the username and password in the database
// 4.Send JSON message confirming account creation 
// 5. Return 201 created status code with the confirming message

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../db/pool.js');

router.post('/register', async function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    //Validation
    if (!username || !password ){
        return res.status(400).json({Message: "Please fill in username and password"});
    }

    //HASHED PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //INSERT USERNAME & PASSWORD TO DATABASE
    const result = await pool.query('INSERT INTO users(username, hashed_password) VALUES($1, $2) RETURNING *;', [username, hashedPassword]);
    return res.status(201).json({Message: "Account created Successfully"});


});
module.exports = router;