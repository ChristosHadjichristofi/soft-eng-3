const constructURL = require('../lib/constructURL');
const chai = require('chai')
const expect = chai.expect;
const exec = require("child_process");

describe('SessionPerPoint URL', () => {
    it("ev_group03 SessionsPerPoint --point 1 --datefrom 20191010 --dateto 20201010 --format json", () => {
        expect(constructURL('/SessionsPerPoint/', '1', '20191010', '20201010', 'json') )
        .to.eq('https://localhost:8765/evcharge/api/SessionsPerPoint/1/20191010/20201010?format=json');
    });
});

describe('SessionPerStation URL', () => {
    it("ev_group03 SessionsPerStation --station 1 --datefrom 20191010 --dateto 20201010 --format json", () => {
        expect(constructURL('/SessionsPerStation/', '1', '20191010', '20201010', 'json') )
        .to.eq('https://localhost:8765/evcharge/api/SessionsPerStation/1/20191010/20201010?format=json');
    });
});

describe('SessionsPerEV URL', () => {
    it("ev_group03 SessionsPerEV --ev ZXY1274 --datefrom 20191010 --dateto 20201010 --format json", () => {
        expect(constructURL('/SessionsPerEV/', 'ZXY1274', '20191010', '20201010', 'json') )
        .to.eq('https://localhost:8765/evcharge/api/SessionsPerEV/ZXY1274/20191010/20201010?format=json');
    });
});

describe('SessionsPerProvider URL', () => {
    it("ev_group03 SessionsPerProvider --provider 1 --datefrom 20191010 --dateto 20201010 --format json", () => {
        expect(constructURL('/SessionsPerProvider/', '1', '20191010', '20201010', 'json') )
        .to.eq('https://localhost:8765/evcharge/api/SessionsPerProvider/1/20191010/20201010?format=json');
    });
});

//HealthCheck
describe('healthcheck URL ', () => {
    it('ev_group03 healthcheck', () => {
        expect( constructURL('/healthcheck') )
        .to.eq('https://localhost:8765/evcharge/api/healthcheck');
    });
});

//Login
describe('login URL ', () => {
    it('ev-group03 login --username admin --password petrol4ever', () => {
        expect( constructURL('/login') )
        .to.eq('https://localhost:8765/evcharge/api/login');
    });
});

//Logout
describe('logout URL ', () => {
    it('ev_group03 logout', () => {
        expect( constructURL('/logout') )
        .to.eq('https://localhost:8765/evcharge/api/logout');
    });
});

//Reset sessions
describe('Reset sessions URL ', () => {
    it('ev_group03 ressetsessions', () => {
        expect( constructURL('/admin/', 'resetsessions') )
        .to.eq('https://localhost:8765/evcharge/api/admin/resetsessions');
    });
});

describe('Mod User URL', () => {
    it("ev_group03 adm --usermod -usr [username] -pw [password] -stAdm [true/false]", () => {
        expect(constructURL('/admin/', 'usermod', 'papoulis', 'shieftalies', true ))
        .to.eq('https://localhost:8765/evcharge/api/admin/usermod/papoulis/shieftalies?isAdministrator=true');
    });
});

//Sessions Update
describe('Sessions Update URL', () => {
    it("ev_group03 adm --sessionsupd --source C:\Users\User\Desktop\a.csv", () => {
        expect(constructURL('/admin/', 'C:\Users\User\Desktop\a.csv' ))
        .to.eq('https://localhost:8765/evcharge/api/admin/C:\Users\User\Desktop\a.csv');
    });
});

//Users
describe('Find User URL', () => {
    it("adm --users --username [username] -stAdm [true/false]", () => {
        expect(constructURL('/admin/', 'users', 'tester1@test.com', 'false' ))
        .to.eq('https://localhost:8765/evcharge/api/admin/users/tester1@test.com?isAdministrator=false');
    });
});

