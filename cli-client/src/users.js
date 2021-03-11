const constructURL = require('../lib/constructURL');
const errorHandler = require('../lib/errorHandler');
const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');
const https = require('https');

module.exports = function(o) {
    
    isWrong = false;
    if (o.username === undefined)
        isWrong = true;

    if (!isWrong) {
        
        param1 = 'users';
        param2 = o.username;
        param3 = o.isStationAdm;

        if (o.isStationAdm === 'true') param3 = 'true'
        else param3 = 'false'
        
        var url = constructURL('/admin/', param1, param2, param3);
        
        fs.readFile('../cli-client/softeng20bAPI.token', 'utf8', (error, data) => {
            if (error){
                console.log(chalk.red('Not authorized user!'))
            }
            else {
                var config = {
                    method: 'get',
                    url: url,
                    headers: { 'X-OBSERVATORY-AUTH': data },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                };
                axios(config)
                .then(res => console.log(res.data))
                .catch(err => {
                    errorHandler(err, 'Please check again the username you typed!');
                })
            }
        })        
    }
    else{
        console.log(chalk.red('Error: mandatory parameters omitted\n'));
        console.log(chalk.yellow('Mandatory Parameters: \n --users \n --username [username]'));
        console.log(chalk.yellow('Optional Parameter: \n --isStationAdm [true/false] \n'));
        console.log(chalk.yellow('ex: ev_group03 Admin --users --username [username] (--isStationAdm [true/false])\n'));
    }
}