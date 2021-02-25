#!/usr/bin/env node

// libraries required
const commands = require("commander");
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
// libraries required

// functions
const healthcheck = require('../src/healthcheck');
const resetsessions = require('../src/resetsessions');
const login = require('../src/login');
const logout = require('../src/logout');
const sessionsperpoint = require('../src/sessionsperpoint');
const sessionsperstation = require('../src/sessionsperstation');
const sessionsperev = require('../src/sessionsperev');
const sessionsperprovider = require('../src/sessionsperprovider');
const moduser = require('../src/moduser');
const users = require('../src/users');
const sessionsupd = require('../src/sessionsupd');
// functions

clear();

console.log(
    chalk.yellow(
        figlet.textSync('BitsPlease', { horizontalLayout: 'full' })
    )
);


// healthcheck
commands.command('healthcheck')
        .alias('hc')
        .description('Confirms end-to-end connectivity between the user and the database')
        .action( function(o) { healthcheck(o) } )
// healthcheck

// reset sessions
commands.command('resetsessions')
        .alias('rs')
        .description('Resets database and sets default admin account')
        .action( function(o) { resetsessions(o) } )
// reset sessions

// login
commands.command('login')
        .alias('lin')
        .description('User/Admin log in')
        .option('-u, --username [username]', 'Username')
        .option('-p, --password [password]', 'Password')
        .action( function(o) { login(o) } )
//login

// logout
commands.command('logout')
        .alias('lout')
        .description('User/Admin log out')
        .action( function(o) { logout(o) } )
// logout

// SessionsPerPoint
commands.command('SessionsPerPoint')
        .alias('spp')
        .description('Returns sessions for a specified point at a specified time period')
        .option('-p, --point [point]', 'PointID')
        .option('-df, --datefrom [date]', 'YYYY-MM-DD')
        .option('-dt, --dateto [date]', 'YYYY-MM-DD')
        .option('-f, --format [format]', 'Content-type', 'json|csv')
        .action( function(o) { sessionsperpoint(o) } )
// SessionsPerPoint

// SessionsPerStation
commands.command('SessionsPerStation')
        .alias('sps')
        .description('Returns sessions for a specified station at a specified time period')
        .option('-s, --station [station]', 'StationID')
        .option('-df, --datefrom [date]', 'YYYY-MM-DD')
        .option('-dt, --dateto [date]', 'YYYY-MM-DD')
        .option('-f, --format [format]', 'Content-type', 'json|csv')
        .action( function(o) { sessionsperstation(o) } )
// SessionsPerStation

// SessionsPerEV
commands.command('SessionsPerEV')
        .alias('spev')
        .description('Returns sessions for a specified ev at a specified time period')
        .option('-ev, --ev [ev]', 'EV Plates')
        .option('-df, --datefrom [date]', 'YYYY-MM-DD')
        .option('-dt, --dateto [date]', 'YYYY-MM-DD')
        .option('-f, --format [format]', 'Content-type', 'json|csv')
        .action( function(o) { sessionsperev(o) } )
// SessionsPerEV

// SessionsPerProvider
commands.command('SessionsPerProvider')
        .alias('sppr')
        .description('Returns sessions for a specified provider at a specified time period')
        .option('-p, --provider [provider]', 'ProviderID')
        .option('-df, --datefrom [date]', 'YYYY-MM-DD')
        .option('-dt, --dateto [date]', 'YYYY-MM-DD')
        .option('-f, --format [format]', 'Content-type', 'json|csv')
        .action( function(o) { sessionsperprovider(o) } )
// SessionsPerProvider

// Admin
commands.command('Admin')
        .alias('adm')
        .description('All admin operations')
        // mod user
        .option('-umod, --usermod [--username [username] --password [password]] --isStationAdm [true/false]', 'Create a new user or alter if already exists.')
        .option('-usr, --username [username]', 'Username')
        .option('-pw, --password [password]', 'Password')
        .option('-stAdm, --isStationAdm [true/false]', 'Set this to true if you want to edit/create station admin user')
        // show all users
        .option('allu, --users')
        // update sessions table
        .option('-su, --sessionsupd', 'Add new records to session table')
        .option('-src, --source [filename]')
        .action( 
            function(o) {
                if (o.usermod !== undefined && o.username !== undefined && o.password !== undefined && o.users === undefined && o.sessionsupd === undefined && o.source === undefined)
                    moduser(o);
                else if (o.users !== undefined && o.usermod === undefined && o.sessionsupd === undefined)
                    users(o);
                else if (o.sessionsupd !== undefined && o.source !== undefined && o.users === undefined && o.usermod === undefined)
                    sessionsupd(o);
                else {
                    console.log(chalk.red('Error occured on your request!'));
                    console.log(chalk.yellow('Choose one of the following sub commands for admin scope:'));
                    console.log(chalk.yellow('--usermod      | -usr   [--username [username] --password [password]] --isStationAdm [true/false]  ~ Modify existing user or create a new user'));
                    console.log(chalk.yellow('--users        | -allu                                                                             ~ Return all users'));
                    console.log(chalk.yellow('--sessionsupd  | -su    [--source [filename]]                                                      ~ Upload sessions file to database'));
                    
                }
            }
        )
// Admin

commands.parse(process.argv);
var scope = process.argv[2];
var scopeList = ['healthcheck', 'hc', 'resetsessions', 'rs', 'login', 'lin', 'logout', 'lout', 'SessionsPerPoint', 'spp',
                 'SessionsPerStation', 'sps', 'SessionsPerEV', 'spev', 'SessionsPerProvider', 'sppr', 'Admin', 'adm'];

if (process.argv.length < 3) {
    console.log(process.argv.length < 3);
    console.log(chalk.red('Error occured! Scope was not specified!'));
    console.log(chalk.yellow('Choose one of the following:'));
    console.log(chalk.yellow('healthcheck          | hc'));
    console.log(chalk.yellow('resetsessions        | rs'));
    console.log(chalk.yellow('login                | lin'));
    console.log(chalk.yellow('logout               | lout'));
    console.log(chalk.yellow('SessionsPerPoint     | spp'));
    console.log(chalk.yellow('SessionsPerStation   | sps'));
    console.log(chalk.yellow('SessionsPerEV        | spev'));
    console.log(chalk.yellow('SessionsPerProvider  | sppr'));
    console.log(chalk.yellow('Admin                | adm'));
}
else if (!scopeList.includes(scope)) {
    console.log(chalk.red('Error, this command does not exist!'));
    console.log(chalk.yellow('For more information, type --help'));
}
