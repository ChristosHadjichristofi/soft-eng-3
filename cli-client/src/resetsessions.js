const constructURL = require('../lib/constructURL');
const axios = require('axios');
const chalk = require('chalk');

module.exports = function(o) {
    var url = constructURL('/admin/', 'resetsessions');
    var config = {
        method: 'post',
        url: url
    };
    axios(config)
    .then(res => console.log(res.data))
    .catch(err => {
        console.log(chalk.red(err.message + '\nReset sessions could not be completed!'));
    })
}