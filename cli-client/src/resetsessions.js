const constructURL = require('../lib/constructURL');
const errorHandler = require('../lib/errorHandler');
const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');

module.exports = function(o) {

    var url = constructURL('/admin/', 'resetsessions');

    fs.readFile('../cli-client/softeng20bAPI.token', 'utf8', (error, data) => {
        if (error){
            console.log(chalk.red('Not authorized user!'))
        }
        else {
            var config = {
                method: 'post',
                url: url,
                headers: {
                    'X-OBSERVATORY-AUTH': data,
                    'Content-Type' :  'multipart/form-data'
                }
            };
            axios(config)
            .then(res => console.log(res.data))
            .catch(err => {
                errorHandler(err, 'Reset sessions could not be completed!')
            })
        }
    })

}