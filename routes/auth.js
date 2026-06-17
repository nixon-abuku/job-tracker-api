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
const jwt = require('jsonwebtoken');

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

//LOG IN 
//POST /auth/login
// WHAT IT DOES: Generates token when a user logs in so that the user doesnt have to put in username and password over and over again
// INPUTS: req.body.username,req.body.password
// OUTPUTS: generated token with status code 200
// STEPS:
// 1.Validate the username and password are present  - return 400 if missing 
// 2.Check if the username exists in the database - return 401 if not found 
// 3.Use bcrypt.compare to compare  password and  the hashed password in the database - return 401 if it doesnt match
// 4.If the username and password are correct and in database - return 200OK with generated token

router.post('/login', async function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    //VALIDATION
    if(!username || !password){
        return res.status(400).json({Message: "Fill in Username and Password"});
    }

    //VALIDATION  IF USERNAME & PASSWORD ARE CORRECT 
    const result = await pool.query('SELECT * FROM users WHERE username = $1;', [username]);
    if (result.rows.length === 0) {
        return res.status(401).json({Message: "Incorrect username"});
    }

    const passwordMatch = await bcrypt.compare(password, result.rows[0].hashed_password);
    if(passwordMatch === false){
        return res.status(401).json({Message: "Incorrect password"});
    }
    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token: token});
});
module.exports = router;

