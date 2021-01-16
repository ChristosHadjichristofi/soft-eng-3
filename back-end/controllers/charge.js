// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const Sequelize = require('sequelize');
const op = Sequelize.Op;

var supported_car_id;

exports.getLicensePlate = (req, res, next) => {

    const licensePlate = req.params.license_plate;

    models.registered_cars.findOne({
        raw: true,
        where: {
            license_plate: licensePlate
        },
        attributes: [
            ['supported_carsid', 'SupportedCarID']
        ]
    })
    .then(registered_car => {
        
        if (registered_car.length == 0) return;

        supported_car_id = registered_car.SupportedCarID;

        return models.supported_cars.findOne({
            raw: true,
            where: {
                id: supported_car_id 
            },
            attributes: [
                ['brand','Brand'],
                ['type','Type'],
                ['model','Model'],
                ['release_year','ReleaseYear'],
                ['variant','Variant'],
                ['usable_battery_size','UsableBatterySize'],
                ['average_consumption','AverageConsumption']
            ]
        })
    })
    .then(supported_car => {

        if (!supported_car) {
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(201).json({
            CarLicensePlate: licensePlate,
            RequestTimestamp: new Date(),
            CarDetails: supported_car
        })
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })

}