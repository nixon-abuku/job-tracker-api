const express = require('express');
const app = express();
const jobRoutes = require('./routes/jobs.js')
app.use(express.json());
app.use('/jobs', jobRoutes);
app.listen(3000, function(){
    console.log("Server started")
});
