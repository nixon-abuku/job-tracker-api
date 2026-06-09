const express = require('express');
const pool = require('./db/pool');
const app = express();
app.use(express.json());
app.get('/jobs', async function(req, res){
    const result = await pool.query('SELECT * FROM jobs;');
    res.json(result.rows);
});
//POST

// WHAT IT DOES: Check the company, posititon, and status are present before inserting them 
// INPUTS: req.body.company, req.body.position, req.body.status
// OUTPUTS: 400 error with message if missing or proceeds to insert if all present
// STEPS:
// 1.Check if company, position or status is missing 
// 2. if missing return 400 with error message 
// 3. If all present run the insert query

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

//PUT 

// WHAT IT DOES: Able to update information to a posted job by indentifying the job through the id 
// INPUTS: req.params.id, req.body.company, req.body.position, req.body.status
// OUTPUTS: JSON message of the updated job with 200 status code 
// STEPS:
// 1. Check if job exists first 
// 2.  if it doesn't return an error message json 404 status code job does not exist 
// 3. If job exists update the info
// 4. Return copy of  updated job in JSON with 200 status code 

app.put('/jobs/:id', async function(req, res){
    const company = req.body.company;
    const position = req.body.position;
    const status = req.body.status;
    const id = Number(req.params.id);

    

    //DATABASE UPDATE
    const result = await pool.query('UPDATE jobs SET company = $1, position = $2, status = $3 WHERE id = $4 RETURNING *;', [company, position, status, id]);
    //VALIDATION 
    if (result.rows.length === 0){
        return res.status(404).json({Message:"Job does not exist"});
    }
    //RETURN UPDATED JOB
    res.status(200).json(result.rows);
});

//DELETE
// WHAT IT DOES: Successfully deletes a job on the database through job id 
// INPUTS: req.params.id
// OUTPUTS: JSON message: job $id Successfully deleted 
// STEPS:
// 1.Check if job exists 
// 2.If job doesn't exist return 404 status code job does not exist 
// 3. If job exists successfully delete it
// 4. Return JSON Message confirming job is deleted


app.delete('/jobs/:id', async function(req, res){
    const id = Number(req.params.id);

    //DELETE JOB
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);

    //VALIDATION 
    if(result.rows.length === 0){
        return res.status(404).json({Message: "Job not found"});
    }
    //JOB DELETE CONFIRMATION
    res.status(200).json({Message: "Job successfully deleted"});
});

app.listen(3000, function(){
    console.log("Server started")
});
