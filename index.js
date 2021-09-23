const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./controllers/auth.controllers');
const app = express();

mongoose.connect('mongodb://localhost/notapp', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true })
    .then(() => console.log('Connect to database'))
    .catch(error => console.log(error));

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', auth);

const port = process.env.port || 8000;
app.listen(port, () => console.log(`Server listen on ${port}`));