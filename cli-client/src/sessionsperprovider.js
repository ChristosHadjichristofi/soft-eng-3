const constructURL = require('../lib/constructURL');
const axios = require('axios');
const chalk = require('chalk');

module.exports = function(o) {
    
    isWrong = false;

    if (o.provider === undefined || o.datefrom === undefined || o.dateto === undefined)
        isWrong = true;

    if (!isWrong) {
        if (o.format === undefined) format = 'json'
        else format = o.format
        
        param1 = o.provider;
        param2 = o.datefrom;
        param3 = o.dateto;

        var url = constructURL('/SessionsPerProvider/', param1, param2, param3, format);
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
    
}