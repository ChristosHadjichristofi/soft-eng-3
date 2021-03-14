const request = require('supertest');
const chai = require('chai')
const expect = chai.expect;
const app = require('../app');

const correctOwner = {
    "email": "tester1@test.com",
    "password": "tester1"
}

const correctStationAdmin = {
    "email": "hadjichristofi@bitsplease.com",
    "password": "codeH"
}

let token;
let response;
let owner_id = '1';
let admin_id = '1';
let year = '2020';
let month = '06';
let invalidmonth = '17';

/* Test cost, energy totals for valid months*/
describe('Test cost, energy totals route as valid owner (Get Request: {baseurl}/invoice/costenergytotals/:ownerid/:year/:month)', () => {
    it('Should return totals with status 200', (done) => {
        request(app)
        .post('/evcharge/api/login')
        .send(correctOwner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/invoice/costenergytotals/' + owner_id + '/' + year + '/' + month)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                token = res.body.token;
                response = res.body;
                expect(res.status).to.eq(200);
                done()
            })
        })
    })
    it('Should return a user object', () => {
        expect(response).to.be.an('object');
    })
});

/* Test cost, energy totals for invalid months*/
describe('Test cost, energy totals route as valid owner for invalid month (Get Request: {baseurl}/invoice/costenergytotals/:ownerid/:year/:month)', () => {
    it('Should return error with status 402', (done) => {
        request(app)
        .post('/evcharge/api/login')
        .send(correctOwner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/invoice/costenergytotals/' + owner_id + '/' + year + '/' + invalidmonth)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                token = res.body.token;
                response = res.body.message;
                expect(res.status).to.eq(402);
                done()
            })
        })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(response).to.eq("No data found!")
    })
});

/* Test charges list for valid months*/
describe('Test charges list route as valid owner (Get Request: {baseurl}/invoice/chargeslist/:ownerid/:year/:month)', () => {
    it('Should return totals with status 200', (done) => {
        request(app)
        .post('/evcharge/api/login')
        .send(correctOwner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/invoice/chargeslist/' + owner_id + '/' + year + '/' + month)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                token = res.body.token;
                response = res.body;
                expect(res.status).to.eq(200);
                done()
            })
        })
    })
    it('Should return a user object', () => {
        expect(response).to.be.an('object');
    })
});

/* Test charges list for invalid months*/
describe('Test charges list route as valid owner for invalid month (Get Request: {baseurl}/invoice/chargeslist/:ownerid/:year/:month)', () => {
    it('Should return error with status 402', (done) => {
        request(app)
        .post('/evcharge/api/login')
        .send(correctOwner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/invoice/chargeslist/' + owner_id + '/' + year + '/' + invalidmonth)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                token = res.body.token;
                response = res.body.message;
                expect(res.status).to.eq(402);
                done()
            })
        })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(response).to.eq("No data found!")
    })
});

/* Test adminlist for valid months*/
describe('Test charges list route as valid station admin (Get Request: {baseurl}/invoice/adminlist/:administratorid/:year/:month', () => {
    it('Should return totals with status 200', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(correctStationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/invoice/adminlist/' + admin_id + '/' + year + '/' + month)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                token = res.body.token;
                response = res.body;
                expect(res.status).to.eq(200);
                done()
            })
        })
    })
    it('Should return a user object', () => {
        expect(response).to.be.an('object');
    })
});

/* Test adminlist for invalid months*/
describe('Test adminlist route as valid owner for invalid month (Get Request: {baseurl}/invoice/adminlist/:administratorid/:year/:month', () => {
    it('Should return error with status 402', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(correctStationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/invoice/adminlist/' + admin_id + '/' + year + '/' + invalidmonth)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                token = res.body.token;
                response = res.body.message;
                expect(res.status).to.eq(402);
                done()
            })
        })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(response).to.eq("No data found!")
    })
});