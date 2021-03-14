const request = require('supertest');
const chai = require('chai')
const expect = chai.expect;
const app = require('../app');

const cordX = "37.947495";
const cordY = "23.664675";
const number = "5";

/* Test map route to show map (get all points) */
let responseShow;
describe('Test map route that gets all map points', () => {
    it('Should return map points with status 200', (done) => {
        request(app)
        .get('/evcharge/api/map/show')
        .end((err, res) => {
            responseShow = res.body;
            expect(res.status).to.eq(200);
            done()
        })
    })
    it('Should return an object', () => {
        expect(responseShow).to.be.an('object');
    })
})

/* Test map route to get nearest points when number query param is undefined*/
let responseNearest;
describe('Test map route that returns nearest points when number query param is undefined', () => {
    it('Should return nearest map points with status 200', (done) => {
        request(app)
        .get('/evcharge/api/map/nearest/' + cordX + '/' + cordY)
        .end((err, res) => {
            responseNearest = res.body;
            expect(res.status).to.eq(200);
            done()
        })
    })
    it('Should return an object', () => {
        expect(responseNearest).to.be.an('object');
    })
})

/* Test map route to get nearest points when number query param is defined */
let resNearestWithNumber;
describe('Test map route that returns nearest points when number query param is defined', () => {
    it('Should return nearest map points with status 200', (done) => {
        request(app)
        .get('/evcharge/api/map/nearest/' + cordX + '/' + cordY + '?number=' + number)
        .end((err, res) => {
            resNearestWithNumber = res.body;
            expect(res.status).to.eq(200);
            done()
        })
    })
    it('Should return an object', () => {
        expect(resNearestWithNumber).to.be.an('object');
    })
})