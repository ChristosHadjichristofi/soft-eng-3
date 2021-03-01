const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
var initModels = require("./models/init-models");
var fs = require('fs');

const populate_db = require('./util/populate-db');

/* ROUTES and how to import routes */
const sessions = require('./routes/sessions');
const login = require('./routes/login');
const charge = require('./routes/charge');
const map = require('./routes/map');
const logout = require('./routes/logout');
const admin = require('./routes/admin');
const chargeaux = require('./routes/chargeaux');
/* end of ROUTES and how to import routes */

const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization', 'X-OBSERVATORY-AUTH');
    next();
});

// /* Routes used by our project */
app.use('/evcharge/api/admin', admin);
app.use('/evcharge/api/login', login);
app.use('/evcharge/api/charge', charge);
app.use('/evcharge/api/map', map);
app.use('/evcharge/api/logout', logout);
app.use('/evcharge/api/chargeaux', chargeaux);
app.use('/evcharge/api', sessions);   
// /*End of routes used by our project */

const port = Number(8765);
initModels(sequelize);
sequelize
    .sync({
        // delete if system is ready to deploy
        // force: true
        // end
    })
    .then(result => {
        // populate_db();
        if (!fs.existsSync('./uploads')){ fs.mkdirSync('./uploads'); }
        app.listen(port, () => console.log(`🚀 Server running on port ${port}!`))
    })
    .catch(err => console.log(err));
