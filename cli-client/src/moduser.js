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

        if (o.isStationAdm === undefined) var url = constructURL('/admin/', param1, param2, param3);
        else var url = constructURL('/admin/', param1, param2, param3, param4);

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
}