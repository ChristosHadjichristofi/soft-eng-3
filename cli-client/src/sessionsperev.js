const constructURL = require('../lib/constructURL');
const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');

module.exports = function(o) {
    
    isWrong = false;

    if (o.ev === undefined || o.datefrom === undefined || o.dateto === undefined)
        isWrong = true;

    if (!isWrong) {
        if (o.format === 'csv') format = 'csv';
        else format = 'json'
        
        param1 = o.ev;
        param2 = o.datefrom;
        param3 = o.dateto;

        var url = constructURL('/SessionsPerEV/', param1, param2, param3, format);

        fs.readFile('../cli-client/softeng20bAPI.token', 'utf8', (error, data) => {
            if (error){
                console.log(chalk.red('Not authorized user!'))
            }
            else {
                var config = {
                    method: 'get',
                    url: url,
                    headers: { 'X-OBSERVATORY-AUTH': data }
                };
                axios(config)
                .then(res => console.log(res.data))
                .catch(err => {
                    console.log(chalk.red(err.message));
                })
            }
        })
    }
    else{
        console.log(chalk.red('Error: mandatory parameters omitted\n'));
        console.log(chalk.yellow('Mandatory Parameters: \n --ev [ev license number] \n --datefrom [YYYYMMDD] \n --dateto [YYYYMMDD]'));
        console.log(chalk.yellow('Optional Parameter: \n --format [json | csv] \n'));
        console.log(chalk.yellow('ex: ev_group03 spev --ev [ev license number] --datefrom [date] --dateto [date] (--format [json | csv])\n'));
    }
    
}