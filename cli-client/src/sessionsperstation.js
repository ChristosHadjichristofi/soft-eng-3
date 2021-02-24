const constructURL = require('../lib/constructURL');
const axios = require('axios');
const chalk = require('chalk');

module.exports = function(o) {
    
    isWrong = false;

    if (o.station === undefined || o.datefrom === undefined || o.dateto === undefined)
        isWrong = true;

    if (!isWrong) {
        if (o.format === undefined) format = 'json'
        else format = o.format
        
        param1 = o.station;
        param2 = o.datefrom;
        param3 = o.dateto;

        var url = constructURL('/SessionsPerStation/', param1, param2, param3, format);
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