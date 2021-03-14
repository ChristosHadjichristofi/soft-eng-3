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

const chargeData = {
    "owner_id": "1",
    "car_license_plate": "ZXY1274",
    "charging_point_id": "1",
    "charging_station_id": "1",
    "connection_time": "2021-03-14T05:05",
    "disconnect_time": "2021-03-14T10:10",
    "kWh_delivered": "101.667",
    "protocol": "normal(20kW)",
    "payment": "card",
    "cost": "12.71",
    "vehicle_type": "bev",
    "rating": "5"
}

const changeRating = {
    "session_id": "5",
    "rating": "4"
}

let token;

/* Test charge completed route */
let resMsg;
describe('Test charge completed route (POST: {baseurl}/charge/completed)', () => {
    it('Should return status 201', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .post('/evcharge/api/charge/completed')
                    .set('X-OBSERVATORY-AUTH', token)
                    .send(chargeData)
                    .end((err, res) => {
                        resMsg = res.body.message;
                        expect(res.status).to.eq(201);
                        done()
                    })
            })
    })
    it('Should return message: \"Sessions record created!\"', () => {
        expect(resMsg).to.eq('Sessions record created!')
    })
})

/* Test add rating for a charging session */
let MsgRating;
describe('Test charge rating route (POST: {baseurl}/charge/setrating)', () => {
    it('Should return status 201', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .post('/evcharge/api/charge/setrating')
                    .set('X-OBSERVATORY-AUTH', token)
                    .send(changeRating)
                    .end((err, res) => {
                        MsgRating = res.body.message;
                        expect(res.status).to.eq(201);
                        done()
                    })
            })
    })
    it('Should return message: \"Rating updated!\"', () => {
        expect(MsgRating).to.eq('Rating updated!')
    })
})

/* Test  get stations route */
let stationsBody;
describe('Test getStations route (GET: {baseurl}/charge/stations)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/stations')
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        stationsBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute StationList', () => {
        expect(stationsBody).to.have.property('StationList')
    })
})

/* Test get years route */
let yearsBody;
describe('Test getYears route (GET: {baseurl}/charge/getyears)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/getyears')
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        yearsBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute yearsList', () => {
        expect(yearsBody).to.have.property('yearsList')
    })
})

/* Test get points route */
let pointsBody;
const stationID = 3;
describe('Test getPoints route (GET: {baseurl}/charge/points/:stationid)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/points/' + stationID)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        pointsBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute PointList', () => {
        expect(pointsBody).to.have.property('PointList')
    })
})

/* Test get license plates route */
let lpBody;
const ownerID = "4";
describe('Test license plates route (GET: {baseurl}/charge/licenseplates/:ownerid)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/licenseplates/' + ownerID)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        lpBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute LicensePlateList', () => {
        expect(lpBody).to.have.property('LicensePlateList')
    })
})

/* Test getownerid route */
let getowneridBody;
const username = "tester1@test.com";
describe('Test getownerid route (GET: {baseurl}/charge/ownerid/:username)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/ownerid/' + username)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        getowneridBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute owner_id', () => {
        expect(getowneridBody).to.have.property('owner_id')
    })
})

/* Test getownerid route with not existing username */
let ownerIDNotExistMsg;
const usernameNotExists = "teeeeester1@test.com";
describe('Test getownerid route with not existing username (GET: {baseurl}/charge/ownerid/:username)', () => {
    it('Should return status 402', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/ownerid/' + usernameNotExists)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        ownerIDNotExistMsg = res.body.message;
                        expect(res.status).to.eq(402);
                        done()
                    })
            })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(ownerIDNotExistMsg).to.eq('No data found!')
    })
})

/* Test getVehicletype route */
let vehicletypeBody;
const licenseplate = "ZXY1274";
describe('Test getVehicletype route with not existing username (GET: {baseurl}/charge/vehicletype/:licenseplate)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/vehicletype/' + licenseplate)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        vehicletypeBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute vehicletype', () => {
        expect(vehicletypeBody).to.have.property('vehicletype')
    })
})

/* Test getVehicletype route with plates not exist*/
let licensePlatesNotExist;
const licenseplateWrong = "ZXY1231274";
describe('Test getVehicletype route with not existing username (GET: {baseurl}/charge/vehicletype/:licenseplate)', () => {
    it('Should return status 402', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/vehicletype/' + licenseplateWrong)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        licensePlatesNotExist = res.body.message;
                        expect(res.status).to.eq(402);
                        done()
                    })
            })
    })
    it('Should return message: \"No data found!\"', () => {
        expect(licensePlatesNotExist).to.eq('No data found!')
    })
})

/* Test getCostperkwh route */
let getCostperkwhBody;
const PointID = "1";
describe('Test getCostperkwh route (GET: {baseurl}/charge/costperkwh/:pointid)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/costperkwh/' + PointID)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        getCostperkwhBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute costperkwh', () => {
        expect(getCostperkwhBody).to.have.property('costperkwh')
    })
})

/* Test getCost route */
let getCostBody;
const connectionTime = "2021-03-14T05:05";
const disconnectiontime = "2021-03-14T10:10";
const protocol = "normal(20kW)";
const costperkwh = "0.12503";
describe('Test getCost route (GET: {baseurl}/charge/cost/:connectionTime/:disconnectiontime/:protocol/:costperkwh)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login')
            .send(owner)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/cost/' + connectionTime + '/' + disconnectiontime + '/' + protocol + '/' + costperkwh)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        getCostBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute kWhDelivered', () => {
        expect(getCostBody).to.have.property('kWhDelivered')
    })
    it('Should have an attribute cost', () => {
        expect(getCostBody).to.have.property('cost')
    })
})

/* Test getAdminstations route */
let getAdminstationsBody;
const administratorid = "1";

describe('Test getAdminstations route (GET: {baseurl}/charge/adminstations/:administratorid)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login?isAdministrator=true')
            .send(stationAdmin)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/adminstations/' + administratorid)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        getAdminstationsBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute StationList', () => {
        expect(getAdminstationsBody).to.have.property('StationList')
    })
})

/* Test getAdminpoints route */
describe('Test getAdminpoints route (GET: {baseurl}/charge/adminpoints/:administratorid)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login?isAdministrator=true')
            .send(stationAdmin)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/adminpoints/' + administratorid)
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        getAdminstationsBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute PointList', () => {
        expect(getAdminstationsBody).to.have.property('PointList')
    })
})

/* Test getProviders route */
let providersBody;
describe('Test getProviders route (GET: {baseurl}/charge/providers)', () => {
    it('Should return status 200', (done) => {
        request(app)
            .post('/evcharge/api/login?isAdministrator=true')
            .send(stationAdmin)
            .end((err, res) => {
                token = res.body.token;
                request(app)
                    .get('/evcharge/api/charge/providers')
                    .set('X-OBSERVATORY-AUTH', token)
                    .end((err, res) => {
                        providersBody = res.body;
                        expect(res.status).to.eq(200);
                        done()
                    })
            })
    })
    it('Should have an attribute ProviderList', () => {
        expect(providersBody).to.have.property('ProviderList')
    })
})