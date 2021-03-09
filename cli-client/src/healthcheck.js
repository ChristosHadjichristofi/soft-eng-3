const constructURL = require('../lib/constructURL');
const errorHandler = require('../lib/errorHandler');
const chalk = require('chalk');
const axios = require('axios');

module.exports = function(o) {
    var url = constructURL('/admin/', 'healthcheck');
    var config = {
        method: 'get',
        url: url
    };
    axios(config)
    .then(res => {
        console.log(chalk.green('Connection status with database: ' + res.data.status))
    })
    .catch(err => {
        errorHandler(err);
    })
    
}