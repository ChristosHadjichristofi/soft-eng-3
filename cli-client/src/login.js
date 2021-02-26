const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');
var qs = require('qs');
const constructURL = require('../lib/constructURL');

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
                        console.log(res.data);
                        fs.writeFile('../cli-client/softeng20bAPI.token', res.data.token, error_create_file => {
                            if (error_create_file) throw error_create_file;
                            console.log(chalk.green('User successfully logged in'));
                        })
                    })
                    .catch(err => {
                        console.log(chalk.red(err.message));
                    })
                }
            }
            else {
                console.log(chalk.red('Error, you already logged in'));
            }
        })        
    }
    else{
        console.log(chalk.red('Error: mandatory parameters omitted\n'));
        console.log(chalk.yellow('Mandatory Parameters: \n --username [username] \n --password [password]\n'));
        console.log(chalk.yellow('ex: ev_group03 login --username [username] --password [password]\n'));
    }
    
}