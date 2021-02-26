const constructURL = require('../lib/constructURL');
const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');

module.exports = function(o) {
    
    isWrong = false;

    if (o.username === undefined || o.password === undefined)
        isWrong = true;

    if (!isWrong) {
        
        param1 = 'usermod';
        param2 = o.username;
        param3 = o.password;
        param4 = o.isStationAdm;

        if (o.isStationAdm === 'true') param4 = 'true'
        else param4 = 'false'
        url = constructURL('/admin/', param1, param2, param3, param4);

        fs.readFile('../cli-client/softeng20bAPI.token', 'utf8', (error, data) => {
            if (error){
                console.log(chalk.red('Not authorized user!'))
            }
            else {
                var config = {
                    method: 'post',
                    url: url,
                    headers: { 'X-OBSERVATORY-AUTH': data }
                };
                axios(config)
                .then(res => console.log(res.data))
                .catch(err => {
                    console.log(chalk.red(err.message + '\nUser could not be created or modified!'));
                })
            }
        })
    }
    else{
        console.log(chalk.red('Error: mandatory parameters omitted\n'));
        console.log(chalk.yellow('Mandatory Parameters: \n --usermod \n --username [username] \n --password [password]'));
        console.log(chalk.yellow('Optional Parameter: \n --isStationAdm [true/false] \n'));
        console.log(chalk.yellow('ex: ev_group03 Admin --usermod --username [username] --password [password] (--isStationAdm [true/false])\n'));
    }
}