require('dotenv').config();
const express = require('express');
const connectdb = require('./app/config/db');

connectdb();

const app = express();
app.use(express.json());

const indexRoutes = require('./app/routes/indexRoutes');
app.use('/api', indexRoutes);


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});



module.exports = app;