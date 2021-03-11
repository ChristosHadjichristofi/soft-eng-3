const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const https = require('https');
const constructURL = require('../lib/constructURL');
const errorHandler = require('../lib/errorHandler');

module.exports = function(o){

    fs.access('../cli-client/softeng20bAPI.token', fs.F_OK, (error_not_exist) => {
        if (error_not_exist) {
            if (error_not_exist.code === 'ENOENT') { 
                console.log(chalk.red('Error, no user is currently logged in!'));
            }
        }
        else {
            let url = constructURL('/logout');
            
            fs.readFile('../cli-client/softeng20bAPI.token', 'utf8', (err, key) => {
                if (err) throw err;
            
                var config = {
                    method: 'post',
                    url: url,
                    headers: { 'X-OBSERVATORY-AUTH': key },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                };

                axios(config)
                .then(function (response) {
                    fs.unlink('../cli-client/softeng20bAPI.token', (err) => {
                        if (err) throw err;
                        console.log(chalk.green('User successfully logged out!'));
                    })
                })
                .catch(function (err) {
                    errorHandler(err);
                });
            })
        }
    });
};