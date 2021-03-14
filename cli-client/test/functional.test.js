// not finished

const chai = require('chai')
const expect = chai.expect;
const { exec } = require("child_process");

describe('Functional tests', () => {
    // user login
    it('Should write in console: \"User successfully logged in\"', (done) => {
        exec("ev_group03 login --username [username] --password [password]", (error, stdout, stderr) => {
            expect(stdout).to.eq('User successfully logged in');
            done();
        });
    });

    // user logout
    it('Should write in console: \"User successfully logged out\"', (done) => {
        exec("ev_group03 logout", (error, stdout, stderr) => {
            expect(stdout).to.eq('User successfully logged out');
            done();
        });
    });

    // admin login
    it('Should write in console: \"Admin successfully logged in\"', (done) => {
        exec("ev_group03 login --username admin --password petrol4ever", (error, stdout, stderr) => {
            expect(stdout).to.eq('Admin successfully logged in');
            done();
        });
    });

    // admin logout
    it('Should write in console: \"Admin successfully logged out\"', (done) => {
        exec("ev_group03 logout", (error, stdout, stderr) => {
            expect(stdout).to.eq('Admin successfully logged out');
            done();
        });
    });

    // SessionsPerPoint
    it('Should write in console: \"Returns sessions for a specified point at a specified time period\"', (done) => {
        exec("ev_group03 spp --point [point id] --datefrom [date] --dateto [date]", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
    });

    // healthcheck
    it('Should write in console: \"Confirms end-to-end connectivity between the user and the database"', (done) => {
        exec("ev_group03 ", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
    });

    // resetsessions
    it('Should write in console: \"Resets database and sets default admin account\"', (done) => {
        exec("ev_group03 ", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
    });

    // SessionsPerStation
    it('Should write in console: \"Returns sessions for a specified station at a specified time period\"', (done) => {
        exec("ev_group03 sps --station [station id] --datefrom [date] --dateto [date] (--format [json | csv])", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
    });

    // SessionsPerEV
    it('Should write in console: \"Returns sessions for a specified ev at a specified time period\"', (done) => {
        exec("ev_group03 spev --ev [ev license number] --datefrom [date] --dateto [date] (--format [json | csv])", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
    });

    // SessionsPerProvider
    it('Should write in console: \"Returns sessions for a specified provider at a specified time period\"', (done) => {
        exec("ev_group03 sppr --provider [provider id] --datefrom [date] --dateto [date] (--format [json | csv])", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
    });

    // Admin
    it('Should write in console: \"All Admin scope options\"', (done) => {
        exec("ev_group03 -usr   --username [username] --password [password] --isStationAdm [true/false]", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
        exec("ev_group03 -allu  --username [username] --isStationAdm [true/false] ", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
        exec("ev_group03 -su    --source [filename] ", (error, stdout, stderr) => {
            expect(stdout).to.eq();
            done();
        });
    });



})