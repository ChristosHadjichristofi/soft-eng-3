#!/usr/bin/env node

// libraries required
const commands = require("commander");
const chalk = require('chalk');
const clear = require('clear');
// libraries required

// functions
const healthcheck = require('./src/healthcheck');
const resetsessions = require('./src/resetsessions');
const login = require('./src/login');
const logout = require('./src/logout');
const sessionsperpoint = require('./src/sessionsperpoint');
const sessionsperstation = require('./src/sessionsperstation');
const sessionsperev = require('./src/sessionsperev');
const sessionsperprovider = require('./src/sessionsperprovider');
const moduser = require('./src/moduser');
const allusers = require('./src/allusers');
const sessionsupd = require('./src/sessionsupd');
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
        .option('-r, --roles [role]', 'Role (admin/user)')
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
        .option('-umod, --usermod [username]', 'Create a new user or alter if already exists.')
        .option('-usr, --username [username]', 'Username')
        .option('pw, --password [password]', 'Password')
        // show all users
        .option('allu, --users')
        // update sessions table
        .option('su, --sessionsupd', 'Add new records to session table')
        .option('src, --source [filename]')
        .action( 
            function(o) {
                if (o.umod !== undefined && o.usr !== undefined && o.pw !== undefined && o.allu === undefined && o.su === undefined && o.src === undefined)
                    moduser(o);
                else if (o.allu !== undefined && o.umod === undefined && o.su === undefined)
                    allusers(o);
                else if (o.su !== undefined && o.src !== undefined && o.allu === undefined && o.umod === undefined)
                    sessionsupd(o);
                else {
                    console.log(chalk.red('Error occured on your request!'));
                    console.log(chalk.yellow('Choose one of the following sub commands for admin scope:'));
                    console.log(chalk.yellow('--usermod     | -n         [username]                ~ Modify existing user or create a new user'));
                    console.log(chalk.yellow('--users       | -allu                                ~ Return all users'));
                    console.log(chalk.yellow('--sessionsup  | -su        [--source [filename]]     ~ Return all users'));
                    
                }
            }
        )
// Admin
commands.parse(process.argv);
if (process.argv.length < 3) {
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
else if ( process.argv[2] !== ('healthcheck' && 'hc')
    && process.argv[2] !== ('resetsessions' && 'rs')
    && process.argv[2] !== ('login' && 'lin')
    && process.argv[2] !== ('SessionsPerPoint' && 'spp')
    && process.argv[2] !== ('SessionsPerStation' && 'sps')
    && process.argv[2] !== ('SessionsPerEV' && 'spev')
    && process.argv[2] !== ('SessionsPerProvider' && 'sppr')
    && process.argv[2] !== ('Admin' && 'adm')) {
        console.log(chalk.red('Error, this command does not exist!'));
        console.log(chalk.yellow('For more information, type --help'));
}
