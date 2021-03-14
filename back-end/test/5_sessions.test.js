const request = require('supertest');
const chai = require('chai')
const expect = chai.expect;
const app = require('../app');

const owner = {
    "email": "tester1@test.com",
    "password": "tester1"
}

const stationAdmin = {
    "email": "hadjichristofi@bitsplease.com",
    "password": "codeH"
}

const yyyymmdd_fromValid = "20190303";
const yyyymmdd_toValid = "20210303";
const yyyymmdd_fromInvalid = "20002020";
const yyyymmdd_toInvalid = "20202021";

/* Test SessionsPerPoint when returning data */
const pointID = "1";
let token;

describe('Test Sessions Per Point route as Valid Station Admin when data is returned (GET Request: {baseurl}/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(stationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerPoint/' + pointID + '/' + yyyymmdd_fromValid + '/' + yyyymmdd_toValid)
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
});

/* Test SessionsPerPoint when no data is returned */
let failMessageSessionsPerPoint;
describe('Test Sessions Per Point route as Valid Station Admin when no data is returned (GET Request: {baseurl}/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return with status 402', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(stationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerPoint/' + pointID + '/' + yyyymmdd_fromInvalid + '/' + yyyymmdd_toInvalid)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                failMessageSessionsPerPoint = res.body.message;
                expect(res.status).to.eq(402);
                done()
            })
        })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(failMessageSessionsPerPoint).to.eq('No data found!')
    })
});

/* Test SessionsPerPoint when user tries to get data */
let FailMessageOwnerSPP;
describe('Test Sessions Per Point route when user tries to get data (GET Request: {baseurl}/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return with status 403', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=false')
        .send(owner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerPoint/' + pointID + '/' + yyyymmdd_fromValid + '/' + yyyymmdd_toValid)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                FailMessageOwnerSPP = res.body.message;
                expect(res.status).to.eq(403);
                done()
            })
        })
    })
    it('Should return message: \"Forbidden\"', () => {
        expect(FailMessageOwnerSPP).to.eq('Forbidden')
    })
});

/* Test SessionsPerStation when returning data */
const stationID = "1";

describe('Test Sessions Per Station route as Valid Station Admin when data is returned (GET Request: {baseurl}/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(stationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerStation/' + stationID + '/' + yyyymmdd_fromValid + '/' + yyyymmdd_toValid)
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
});

/* Test SessionsPerPoint when no data is returned */
let failMessageSessionsPerStation;
describe('Test Sessions Per Station route as Valid Station Admin when no data is returned (GET Request: {baseurl}/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return with status 402', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(stationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerStation/' + stationID + '/' + yyyymmdd_fromInvalid + '/' + yyyymmdd_toInvalid)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                failMessageSessionsPerStation = res.body.message;
                expect(res.status).to.eq(402);
                done()
            })
        })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(failMessageSessionsPerStation).to.eq('No data found!')
    })
});

/* Test SessionsPerStation when user tries to get data */
let FailMessageOwnerSPS;
describe('Test Sessions Per Point route when user tries to get data (GET Request: {baseurl}/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return with status 403', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=false')
        .send(owner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerStation/' + stationID + '/' + yyyymmdd_fromValid + '/' + yyyymmdd_toValid)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                FailMessageOwnerSPS = res.body.message;
                expect(res.status).to.eq(403);
                done()
            })
        })
    })
    it('Should return message: \"Forbidden\"', () => {
        expect(FailMessageOwnerSPS).to.eq('Forbidden')
    })
});

/* Test SessionsPerEV when returning data */
const vehicleID = "ZXY1274";

describe('Test Sessions Per EV route as Valid Owner when data is returned (GET Request: {baseurl}/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=false')
        .send(owner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerEV/' + vehicleID + '/' + yyyymmdd_fromValid + '/' + yyyymmdd_toValid)
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
});

/* Test SessionsPerEV when no data is returned */
let failMessageSessionsPerEV;
describe('Test Sessions Per EV route as Valid owner when no data is returned (GET Request: {baseurl}/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return with status 402', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=false')
        .send(owner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerEV/' + vehicleID + '/' + yyyymmdd_fromInvalid + '/' + yyyymmdd_toInvalid)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                failMessageSessionsPerEV = res.body.message;
                expect(res.status).to.eq(402);
                done()
            })
        })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(failMessageSessionsPerEV).to.eq('No data found!')
    })
});

/* Test SessionsPerEV when Station Admin tries to get data */
let FailMessageStAdminSPEV;
describe('Test Sessions Per EV route when Station Admin tries to get data (GET Request: {baseurl}/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return with status 403', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(stationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerEV/' + vehicleID + '/' + yyyymmdd_fromValid + '/' + yyyymmdd_toValid)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                FailMessageStAdminSPEV = res.body.message;
                expect(res.status).to.eq(403);
                done()
            })
        })
    })
    it('Should return message: \"Forbidden\"', () => {
        expect(FailMessageStAdminSPEV).to.eq('Forbidden')
    })
});

/* Test SessionsPerProvider when returning data */
const providerID = "1";

describe('Test Sessions Per EV route as Valid stationAdmin when data is returned (GET Request: {baseurl}/SessionsPerProvider/:providerID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(stationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerProvider/' + providerID + '/' + yyyymmdd_fromValid + '/' + yyyymmdd_toValid)
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
});

/* Test SessionsPerProvider when no data is returned */
let failMessageSessionsPerProvider;
describe('Test Sessions Per EV route as Valid owner when no data is returned (GET Request: {baseurl}/SessionsPerProvider/:providerID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return with status 402', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=true')
        .send(stationAdmin)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerProvider/' + providerID + '/' + yyyymmdd_fromInvalid + '/' + yyyymmdd_toInvalid)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                failMessageSessionsPerProvider = res.body.message;
                expect(res.status).to.eq(402);
                done()
            })
        })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(failMessageSessionsPerProvider).to.eq('No data found!')
    })
});

/* Test SessionsPerProvider when Station Admin tries to get data */
let FailMessageStAdminSPPr;
describe('Test Sessions Per EV route when owner tries to get data (GET Request: {baseurl}/SessionsPerProvider/:providerID/:yyyymmdd_from/:yyyymmdd_to)', () => {
    it('Should return with status 403', (done) => {
        request(app)
        .post('/evcharge/api/login?isAdministrator=false')
        .send(owner)
        .end((err, res) => {
            token = res.body.token;
            request(app)
            .get('/evcharge/api/SessionsPerProvider/' + providerID + '/' + yyyymmdd_fromValid + '/' + yyyymmdd_toValid)
            .set('X-OBSERVATORY-AUTH', token)
            .end((err, res) => {
                FailMessageStAdminSPPr = res.body.message;
                expect(res.status).to.eq(403);
                done()
            })
        })
    })
    it('Should return message: \"Forbidden\"', () => {
        expect(FailMessageStAdminSPPr).to.eq('Forbidden')
    })
});