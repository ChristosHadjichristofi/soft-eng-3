const app = require('./app');
const https = require('https');
var fs = require('fs');
const sequelize = require('./util/database');
const path = require('path');
const chalk = require('chalk');

var initModels = require("./models/init-models");
const populate_db = require('./util/populate-db');

const port = Number(8765);
const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem'))
    }, app)

initModels(sequelize);
sequelize
    .sync({
        // delete if system is ready to deploy
        // force: true
        // end
    })
    .then(result => {
        // populate_db();
        if (!fs.existsSync('./uploads')) { fs.mkdirSync('./uploads'); }
        sslServer.listen(port, () => console.log(chalk.green(`🚀 Secure Server running on port ${port}!`)))
    })
    .catch(err => console.log(err));