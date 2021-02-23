const constructURL = require('./lib/constructURL');
const sendReq = require('./lib/sendReq');


module.exports = function(o) {

    var url = constructURL('/healthcheck');
    sendReq('get', url)
}