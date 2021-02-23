const axios = require('axios');
const chalk = require('chalk');

module.exports = function(reqType, extUrl, header, body) {
    var config;

    if (reqType === get) {

        config.set('method', 'get');
        config.set('url', url);

        if (header === undefined) {
            axios(config)
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(chalk.red(err.message));
            })
            break;
        }
        else {
            config.set('headers', { 'X-OBSERVATORY-AUTH': header })
            axios(config)
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(chalk.red(err.message));
            })
            break;
        }
    }
    else if (reqType === post) {
        
        config.set('method', 'post');
        config.set('url', url);

        if (header === undefined) {
            axios(config)
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(chalk.red(err.message));
            })
            break;
        }
        else {
            if (body.source === undefined){
                config.set('headers', { 'X-OBSERVATORY-AUTH': header })
            }
            else {
                config.set('headers', {
                    'X-OBSERVATORY-AUTH': header,
                    'Content-Type' :  'multipart/form-data'
                })
            }
            config.set('body', body);
            axios(config)
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(chalk.red(err.message));
            });
            break;
        }
    }
}