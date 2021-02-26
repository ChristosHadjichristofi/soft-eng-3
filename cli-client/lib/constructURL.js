module.exports = function (scope, param1, param2, param3, format, apikey) {
    let base = 'http://localhost:8765/evcharge/api';
    // create url with scope
    base = base + scope;

    // create url for SessionsPerPoint, SessionsPerStation, SessionsPerEV, SessionsPerProvider
    if (scope === '/SessionsPerPoint/' || scope === '/SessionsPerStation/' || scope === '/SessionsPerEV/' || scope === '/SessionsPerProvider/') {
        base = base + param1 + '/' + param2 + '/' + param3 + '?format=' + format;
    }
    // create url for Admin scope
    // healthcheck 
    // resetsessions
    // usermod /admin/usermod/param1/param2 -> param1 = usermod, param2 = username, param3 = password
    // users
    // sessionsupd /admin/system/sessionsupd/
    else if (scope === '/admin/') {
        if (param1 === 'sessionsupd') base = base + 'system/' + param1;
        else if (param1 === 'usermod') base = base + param1 + '/' + param2 + '/' + param3 + '?isAdministrator=' + param4;
        else if (param1 === 'users') base = base + param1 + '/' + param2 + '?isAdministrator=' + param3;
        else base = base + param1;
    }
    return base;
}