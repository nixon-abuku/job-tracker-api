const express = require('express');
const pool = require('./db/pool');
const app = express();
app.use(express.json());
app.get('/jobs', async function(req, res){
    const result = await pool.query('SELECT * FROM jobs;');
    res.json(result.rows);
});

app.post('/jobs', async function(req, res){
    const company = req.body.company
    const position = req.body.position
    const status = req.body.status

    // VALIDATION 
    if (!company || !position || !status){
        return res.status(400).json({Message: "Please fill the required fields"})
    }

    //DATABASE INSERT 
    const result = await pool.query('INSERT INTO jobs (company, position, status) VALUES($1, $2, $3) RETURNING *', [company, position, status]);
    res.status(201).json(result.rows);
});


app.listen(3000, function(){
    console.log("Server started")
});


// WHAT IT DOES: Check the company, posititon, and status are present before inserting them 
// INPUTS: req.body.company, req.body.position, req.body.status
// OUTPUTS: 400 error with message if missing or proceeds to insert if all present
// STEPS:
// 1.Check if company, position or status is missing 
// 2. if missing return 400 with error message 
// 3. If all present run the insert query