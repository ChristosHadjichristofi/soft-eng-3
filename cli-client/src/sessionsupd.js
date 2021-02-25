const constructURL = require('../lib/constructURL');
const chalk = require('chalk');
const request = require('request');
const fs = require('fs');

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
                        'Content-Type' :  'multipart/form-data'
                    },
                    formData: {
                        "file" : fs.createReadStream(o.source)  
                    }
                };
                request(config, function (err, _, body) {
                    if(err) console.log(err);
                    else console.log(body);
                }); 
            }
        })
    }
}