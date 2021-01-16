// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const Sequelize = require('sequelize');
const op = Sequelize.Op;

exports.getShowMap = (req, res, next) => {

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
        console.log(stations)
        if (stations.length == 0) {
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(201).json({
            RequestTimestamp: new Date(),
            StationsList: stations
        })
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })

}