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
    const result = await pool.query('INSERT INTO jobs (company, position, status) VALUES($1, $2, $3) RETURNING *', [company, position, status]);
    res.status(201).json(result.rows);
});


app.listen(3000, function(){
    console.log("Server started")
});