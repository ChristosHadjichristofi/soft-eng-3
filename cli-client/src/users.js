const constructURL = require('../lib/constructURL');
const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');

module.exports = function(o) {
    
    isWrong = false;

    if (o.users === undefined || o.username === undefined)
        isWrong = true;

    if (!isWrong) {
        
        param1 = 'users';
        param2 = o.username;
        
        var url = constructURL('/admin/', param1, param2);

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
                    console.log(chalk.red(err.message + '\nUser does not exist!'));
                })
            }
        })        
    }
}