const constructURL = require('../lib/constructURL');
const chalk = require('chalk');
const axios = require('axios');

module.exports = function(o) {
    
    isWrong = false;

    if (o.username === undefined || o.password === undefined)
        isWrong = true;

    if (!isWrong) {
        
        param1 = 'usermod';
        param2 = o.username;
        param3 = o.password;
        
        var url = constructURL('/admin/', param1, param2, param3);
        var config = {
            method: 'post',
            url: url
        };

        axios(config)
        .then(res => console.log(res.data))
        .catch(err => {
            console.log(chalk.red(err.message + '\nUser could not be created or modified!'));
        })
    }
    
}