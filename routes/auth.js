//IMPORT  EXPRESS 
const express = require('express');

// IMPORT POOL DB
 const pool = require('../db/pool.js');


//IMPORT BCRYPT 
const bcrypt = require('bcrypt');

//IMPORT JSONWEBTOKEN
const jwt = require('jsonwebtoken');

//ROUTER
const router = express.Router();

// POST/AUTH/REGISTER 
router.post('/register', async function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    // VALIDATION IF USERNAME OR PASSWORD MISSING 
    if (!username || !password){
        return res.status(400).json({message: "Please fill in all required fields"});
    }
    try{
         // BYCRYPT HASH PASSWORD 
         const hashedPassword = await bcrypt.hash(password, 10);
         
         //STORE IN DATABASE
         const result = await pool.query('INSERT INTO users(username, hashed_password) VALUES($1, $2) RETURNING username;', [username, hashedPassword]);
         return res.status(201).json(result.rows[0]); 
        }
    catch(error){
        //IF USERNAME ALREADY EXISTS IN DB
        if (error.code === "23505"){
            return res.status(409).json({message: "username already exists"});
        }else{
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
});

// POST/AUTH/LOGIN
router.post('/login', async function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    // VALIDATION IF USERNAME AND PASSWORD ARE FILLED
    if (!username || !password){
        return res.status(400).json({message: "Please fill in the required fields"});
    }

    //
    try{
        // QUERY THE DATABASE FOR SUBMITTED USERNAME
        const result = await pool.query('SELECT id, username, hashed_password FROM users WHERE username = $1',[username]);

        //VALIDATION TO CHECK IF USERNAME EXISTS IN DB
        if (result.rows.length === 0){
            return res.status(401).json({message: "Invalid username or password"});
        }
        const foundUser = result.rows[0];

        //PASSWORD COMPARISON
        const isMatch = await bcrypt.compare(password, foundUser.hashed_password);

        //VALIDATION IF PASSWORD IS FALSE AND DOESN'T MATCH
        if (isMatch === false){
            return res.status(401).json({message: "Invalid username or password"});
        }

        //TOKEN CREATION 
        const token = jwt.sign(
            {userId: foundUser.id},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );
        //TOKEN CREATION SUCCESS 
        return res.status(200).json({message: "token created successfully",
            token: token });

    }

    // ERROR IN CASE ANYTHING BREAKS DOWN IN CODE 
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal Server error"});
    }
})

module.exports = router;