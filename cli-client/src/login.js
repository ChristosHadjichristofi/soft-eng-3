const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');
var qs = require('qs');
const constructURL = require('../lib/constructURL');
const errorHandler = require('../lib/errorHandler');

module.exports = function(o) {
    
    isWrong = false;
    if (o.username === undefined || o.password === undefined)
        isWrong = true;

    if (!isWrong) {
        
        fs.access('../cli-client/softeng20bAPI.token', fs.F_OK, (error_not_exist) => {
            if (error_not_exist) {
                if (error_not_exist.code === 'ENOENT') {
                    var url = constructURL('/admin/', 'login');

                    var data = qs.stringify({
                        'username': o.username,
                        'password': o.password 
                    });
                    var config = {
                        method: 'post',
                        url: url,
                        headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data : data
                    };
                       
                    axios(config)
                    .then(res => {
                        fs.writeFile('../cli-client/softeng20bAPI.token', res.data.token, error_create_file => {
                            if (error_create_file) throw error_create_file;
                            console.log(chalk.green('User successfully logged in'));
                        })
                    })
                    .catch(err => {
                        errorHandler(err);
                    })
                }
            }
            else {
                console.log(chalk.red('Error, you already logged in!'));
                console.log(chalk.yellow('Please use the following command for more: ev_group03 --help'))
            }
        })        
    }
    else{
        console.log(chalk.red('Error: mandatory parameters omitted\n'));
        console.log(chalk.yellow('Mandatory Parameters: \n --username [username] \n --password [password]\n'));
        console.log(chalk.yellow('ex: ev_group03 login --username [username] --password [password]\n'));
    }
    
}