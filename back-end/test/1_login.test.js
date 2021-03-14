const request = require('supertest');
const chai = require('chai')
const expect = chai.expect;
const app = require('../app');

const owner = {
    "email": "tester1@test.com",
    "password": "tester1"
}

const ownerWrongPass = {
    "email": "tester1@test.com",
    "password": "tester15"    
}

/* Test user Login */
let token;
let response;
describe('Test login route as Owner (Post Request: {baseurl}/login)', () => {
    it('Should Login with status 200', (done) => {
        request(app)
        .post('/evcharge/api/login')
        .send(owner)
        .end((err, res) => {
            token = res.body.token;
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
let failMessage;
describe('Test login route as Owner with Wrong Credentials (Post Request: {baseurl}/login)', () => {
    it('Should fail with status 401', (done) => {
        request(app)
        .post('/evcharge/api/login/')
        .send(ownerWrongPass)
        .end((err, res) => {
            failMessage = res.body.message;
            expect(res.status).to.eq(401);
            done()
        })
    })
    it('Should return message: \"Wrong credentials!\"', () => {
        expect(failMessage).to.eq('Wrong credentials!')
    })
});