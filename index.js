const express = require('express');
const pool = require('./db/pool');
const app = express();
app.use(express.json());
app.get('/jobs', async function(req, res){
    const result = await pool.query('SELECT * FROM jobs;');
    res.json(result.rows);
});
app.listen(3000, function(){
    console.log("Server started")
});
