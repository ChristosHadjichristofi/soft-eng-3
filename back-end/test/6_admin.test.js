const request = require('supertest');
const chai = require('chai')
const expect = chai.expect;
const app = require('../app');
var fs = require('fs');

const sysadmin = {
    "username": "admin",
    "password": "petrol4ever" 
}
const sysadminWrongPass = {
    "username": "admin",
    "password": "petrol42ever" 
}

/* Test user Login */
let tokenSysAdmin;
let response;
describe('Test login route as SysAdmin (Post Request: {baseurl}/admin/login)', () => {
    it('Should Login with status 200', (done) => {
        request(app)
        .post('/evcharge/api/admin/login')
        .send(sysadmin)
        .end((err, res) => {
            tokenSysAdmin = res.body.token;
            response = res.body;
            expect(res.status).to.eq(200);
            done()
        })
    })
    it('Should return a token', () => {
        expect(response).to.have.property('token')
    })
});

/* Test user with wrong credentials */
let failMessageSysAdmin;
describe('Test login route as SysAdmin with Wrong Credentials (Post Request: {baseurl}/login)', () => {
    it('Should fail with status 401', (done) => {
        request(app)
        .post('/evcharge/api/admin/login/')
        .send(sysadminWrongPass)
        .end((err, res) => {
            failMessageSysAdmin = res.body.message;
            expect(res.status).to.eq(401);
            done()
        })
    })
    it('Should return message: \"Wrong credentials!\"', () => {
        expect(failMessageSysAdmin).to.eq('Wrong credentials!')
    })
});

/* Test admin route to fetch a user by username */
const ownerEmail = "tester1@test.com"
let ownerResBody;
describe('Test admin getUser (GET: {baseurl}/admin/users/:username', () => {
    it('Should return with status 200', (done) => {
        request(app)
        .get('/evcharge/api/admin/users/' + ownerEmail)
        .set('X-OBSERVATORY-AUTH', tokenSysAdmin)
        .end((err, res) => {
            ownerResBody = res.body;
            expect(res.status).to.eq(200);
            done();
        })
    })
    it('Should return a user object', () => {
        expect(ownerResBody).to.be.an('object');
    })
})

/* Test admin route to fetch a user by username that does not exist */
const ownerEmailNotExist = "tsimikas21@tester.com"
let failMessageGetOwner;
describe('Test admin getUser when given username that does not exist (GET: {baseurl}/admin/users/:username', () => {
    it('Should fail with status 402', (done) => {
        request(app)
        .get('/evcharge/api/admin/users/' + ownerEmailNotExist)
        .set('X-OBSERVATORY-AUTH', tokenSysAdmin)
        .end((err, res) => {
            failMessageGetOwner = res.body.message;
            expect(res.status).to.eq(402);
            done()
        })
    })
    it('Should return message: \"User was not found!\"', () => {
        expect(failMessageGetOwner).to.eq('User was not found!')
    })
})

/* Test admin route healthcheck */
describe('Test admin healthcheck (GET: {baseurl}/admin/healthcheck', () => {
    it('Should return with status 200', () => {
        request(app)
        .get('/evcharge/api/admin/healthcheck/')
        .end((err, res) => {
            expect(res.status).to.eq(200);
        })
    })
})

/* Test admin route post usermod when user does not exist */
const emailUserSignUp = "valbuena@tester.com";
const passwordUserSignUp = "valbuena123";
let returnMessageSignUp;
describe('Test admin Usermod (POST: {baseurl}/admin/usermod/:email/:password', () => {
    it('Should return with status 201', (done) => {
        request(app)
        .post('/evcharge/api/admin/usermod/' + emailUserSignUp + '/' + passwordUserSignUp)
        .set('X-OBSERVATORY-AUTH', tokenSysAdmin)
        .end((err, res) => {
            returnMessageSignUp = res.body.message;
            expect(res.status).to.eq(201);
            done();
        })
    })
    it('Should return message: \"Account created succesfully!\"', () => {
        expect(returnMessageSignUp).to.eq('Account created succesfully!')
    })
})

/* Test admin route post usermod when user does exist */
const emailUserChangePW = "tester35@test.com";
const passwordUserChangePW = "tester35";
let returnMessageChangePW;
describe('Test admin Usermod (POST: {baseurl}/admin/usermod/:email/:password', () => {
    it('Should return with status 200', (done) => {
        request(app)
        .post('/evcharge/api/admin/usermod/' + emailUserChangePW + '/' + passwordUserChangePW)
        .set('X-OBSERVATORY-AUTH', tokenSysAdmin)
        .end((err, res) => {
            returnMessageChangePW = res.body.message;
            expect(res.status).to.eq(200);
            done();
        })
    })
    it('Should return message: \"Password changed succesfully!\"', () => {
        expect(returnMessageChangePW).to.eq('Password changed succesfully!')
    })
})

/* Test admin route reset sessions */
let responseResetStatus;
describe('Test admin reset sessions (POST: {baseurl}/resetsessions', () => {
    it('Should return with status 200', (done) => {
        request(app)
        .post('/evcharge/api/admin/resetsessions')
        .set('X-OBSERVATORY-AUTH', tokenSysAdmin)
        .end((err, res) => {
            responseResetStatus = res.body.status;
            expect(res.status).to.eq(200);
            done();
        })
    })
    it('Should return message: "OK! sessions cleared"', () => {
        expect(responseResetStatus).to.eq('OK! sessions cleared')
    })
})

/* Test admin route to post sessions through csv */
let responseSessionsUpd;
describe('Test admin sessions update (POST: {baseurl}/system/sessionsupd', () => {
    it('Should return with status 201', (done) => {
        request(app)
        .post('/evcharge/api/admin/system/sessionsupd')
        .set('X-OBSERVATORY-AUTH', tokenSysAdmin)
        .attach('file', fs.readFileSync('./test/test_session.csv'), 'test_session.csv')
        .end((err, res) => {
            responseSessionsUpd = res.body;
            expect(res.status).to.eq(201);
            done();
        })
    })
    it('Should have an attribute SessionsInUploadedFile', () => {
        expect(responseSessionsUpd).to.have.property('SessionsInUploadedFile')
    })
    it('Should have an attribute SessionsImported', () => {
        expect(responseSessionsUpd).to.have.property('SessionsImported')
    })
    it('Should have an attribute TotalSessionsInDatabase', () => {
        expect(responseSessionsUpd).to.have.property('TotalSessionsInDatabase')
    })
})