const express = require('express');
const bodyParser = require('body-parser');

/* 
ROUTES and how to import routes
*/
const sessions = require('./routes/sessions');
const login = require('./routes/login');
const logout = require('./routes/logout');
const admin = require('./routes/admin');


const app = express();

app.use(bodyParser.json()); 

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/evcharge/api/admin', admin);
app.use('/evcharge/api/login', login);
app.use('/evcharge/api/logout', logout);
app.use('/evcharge/api', sessions);            





app.listen(8765);

