module.exports = function (scope, param1, param2, param3, format, apikey) {
    let base = 'http://localhost:8765/evcharge/api';
    base = base + type;

    if (scope === '/SessionsPerPoint/' || scope === '/SessionsPerStation/' || scope === '/SessionsPerEV/' || scope === '/SessionsPerProvider/') {
        base = base + param1 + '/' + param2 + '/' + param3 + '?format=' + format;
    }
    else if (scope === '/admin/')
}