const constructURL = require('../lib/constructURL');
const chalk = require('chalk');
const axios = require('axios');

module.exports = function(o) {
    var url = constructURL('/admin/', 'healthcheck');
    var config = {
        method: 'get',
        url: url
    };
    axios(config)
    .then(res => console.log(res.data))
    .catch(err => {
        console.log(chalk.red(err.message));
    })
    
}