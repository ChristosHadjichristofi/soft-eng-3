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
            res.status(201).json({
                RequestTimestamp: new Date(),
                StationsList: stations
            })
        }
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })

}