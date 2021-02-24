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
        var config = {
            method: 'post',
            url: url,
            headers: {
                // 'X-OBSERVATORY-AUTH': prepei na mpei auth,
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
}