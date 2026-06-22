//IMPORT  EXPRESS 
const express = require('express');

// IMPORT POOL DB
 const pool = require('../db/pool.js');


//IMPORT BCRYPT 
const bcrypt = require('bcrypt');

//ROUTER
const router = express.Router();

// POST REGISTER 
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

module.exports = router;