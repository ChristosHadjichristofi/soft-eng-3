const constructURL = require('../lib/constructURL');
const errorHandler = require('../lib/errorHandler');
const chalk = require('chalk');
const request = require('request');
const fs = require('fs');
const https = require('https');

module.exports = function(o) {
    
    isWrong = false;

    if (o.source === undefined)
        isWrong = true;

    if (!isWrong) {
        
        param1 = 'sessionsupd';
        
        var url = constructURL('/admin/', param1);

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
                        'Content-Type' : 'multipart/form-data'
                    },
                    formData: {
                        "file" : fs.createReadStream(o.source)  
                    },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                };
                request(config, function (err, data, body) {
                    if(err) console.log(chalk.red("This file doesn't exist!\nPlease choose an other file!"));
                    else {
                        console.log(chalk.green("Sessions in Uploaded File: " + JSON.parse(body).SessionsInUploadedFile));
                        console.log(chalk.green("Sessions Imported: " + JSON.parse(body).SessionsImported));
                        console.log(chalk.green("Total Sessions in Database: " + JSON.parse(body).TotalSessionsInDatabase));
                    }
                }); 
            }
        })
    }
}