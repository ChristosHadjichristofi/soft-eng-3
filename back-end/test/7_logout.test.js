const request = require('supertest');
const chai = require('chai')
const expect = chai.expect;
const app = require('../app');

const owner = {
    "email": "tester1@test.com",
    "password": "tester1"
}

/* Test logout route */
describe('Test logout route, when logged in as user', () => {
    it('Should return status 200', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=false')
        .send(owner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .post('/evcharge/api/logout')
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                response = res.body;
                expect(res.status).to.eq(200);
                done()
            })
        })
    })
    it('Should return an object', () => {
        expect(response).to.be.an('object');
    })
})

/* Test logout when no token is given */
let failMsgNoTokenSupplied;
describe('Test logout route, when no token is given', () => {
    it('Should return status 500', (done) => {
        
        request(app)
        .post('/evcharge/api/logout')
        .end((err, res) => {
            failMsgNoTokenSupplied = res.body.message;
            expect(res.status).to.eq(500);
            done()
        })

    })
    it('Should return message: \"Auth token is not supplied\"', () => {
        expect(failMsgNoTokenSupplied).to.eq('Auth token is not supplied')
    })
})

/* Test logout when already logged out */
let failMsgAlreadyLoggedOut;
describe('Test logout route, when logged in as user and user already logged out', () => {
    it('Should return status 400', (done) => {
        request(app)
        .post('/evcharge/api/logout')
        .set('X-OBSERVATORY-AUTH', token)
        .end((err, res) => {
            failMsgAlreadyLoggedOut = res.body.message;
            expect(res.status).to.eq(400);
            done()
        })
    })
    it('Should return message: \"You are already logged out.\"', () => {
        expect(failMsgAlreadyLoggedOut).to.eq('You are already logged out.')
    })
})