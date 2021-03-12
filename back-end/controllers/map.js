// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const Sequelize = require('sequelize');
const op = Sequelize.Op;

exports.getShowMap = (req, res, next) => {

    const format = req.query.format;

    models.charging_stations.findAll({
        raw: true,
        order: [
            ['station_id', 'ASC'],
        ],
        attributes: [
            ['station_id','StationID'],
            ['station_name','StationName'],
            ['latitude','Latitude'],
            ['longitude','Longitude']
        ]
    })
    .then(stations => {
        if (stations.length == 0) {
            return res.status(402).json({ message: "No data found!" })
        }

        if (format == 'csv') {
            var updStationRecord;
            var stationsArr = [];
            stations.forEach(stationRecord => {
                updStationRecord = {
                    RequestTimestamp: new Date(),
                    ...stationRecord
                }
                stationsArr.push(updStationRecord);
            })
            res.csv(stationsArr, 200);

        }
        else {
            res.status(200).json({
                RequestTimestamp: new Date(),
                StationsList: stations
            })
        }
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({message: "Internal server error."});
    })

}


exports.getNearestStations = (req, res, next) => {

    const format = req.query.format;
    const cordX = req.params.cordX;
    const cordY = req.params.cordY;
    var number = req.query.number;

    if (!cordX || !cordY) return res.status(400).json({message: 'Some parameters are undefined'});

    models.charging_stations.findAll({
        raw: true,
        order: [
            ['station_id', 'ASC'],
        ],
        attributes: [
            ['station_id','StationID'],
            ['station_name','StationName'],
            ['latitude','Latitude'],
            ['longitude','Longitude']
        ]
    })
    .then(stations => {
        if (stations.length == 0) {
            return res.status(402).json({ message: "No data found!" })
        }
        
        for(i =0 ; i < stations.length ; i++){
            stations[i].Distance = Math.sqrt( Math.pow((stations[i].Latitude - cordX),2) + Math.pow((stations[i].Longitude - cordY),2));
        }
        stations.sort(function(a,b){return a.Distance - b.Distance});
        if(number > stations.length || number === undefined) number = stations.length;
        stations = stations.slice(0,number);

        if (format == 'csv') {
            var updStationRecord;
            var stationsArr = [];
            stations.forEach(stationRecord => {
                updStationRecord = {
                    RequestTimestamp: new Date(),
                    ...stationRecord
                }
                stationsArr.push(updStationRecord);
            })
            res.csv(stationsArr, 200);

        }
        else {
            res.status(200).json({
                RequestTimestamp: new Date(),
                StationsList: stations
            })
        }
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({message: "Internal server error."});
    })

}
