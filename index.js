const express = require('express');
const app = express();
const jobRoutes = require('./routes/jobs.js');
const authRoutes = require('./routes/auth.js');
app.use(express.json());
app.use('/jobs', jobRoutes);
app.use('/auth', authRoutes);
app.listen(3000, function(){
    console.log("Server started")
});
