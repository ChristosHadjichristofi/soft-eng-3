// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const Sequelize = require('sequelize');
const op = Sequelize.Op;

exports.getCostenergytotals = (req, res, next) => {

    const ownerid = req.params.ownerid;
    const year = req.params.year;
    const month = req.params.month;

    if (!ownerid || !year || !month) return res.status(400).json({message: 'Some parameters are undefined'});

    sequelize.query('SELECT SUM(sessions.kWhDelivered) AS total_energy_consumed, SUM(sessions.cost) AS total_cost'
        + ' FROM sessions'
        + ' WHERE sessions.driven_byowner_id = ' + ownerid
        + ' AND sessions.connectionTime LIKE \'' + year + '-' + month + '%\'', { type: sequelize.QueryTypes.SELECT })
        .then(rows => {

            costenergytotals = rows[0];
            if (!costenergytotals) {
                return res.status(402).json({ message: "No data found!" })
            }
            if (costenergytotals.total_cost == null) {
                return res.status(402).json({ message: "No data found!" })
            }
            console.log(costenergytotals);
            res.status(200).json({
                total_energy_consumed: costenergytotals.total_energy_consumed,
                total_cost: costenergytotals.total_cost
            })

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ message: "Internal server error." });
        })
}

exports.getChargeslist = (req, res, next) => {

    const ownerid = req.params.ownerid;
    const year = req.params.year;
    const month = req.params.month;

    if (!ownerid || !year || !month) return res.status(400).json({message: 'Some parameters are undefined'});

    sequelize.query(' SELECT sessions.driven_byregistered_carslicense_plate AS license_number,'
        + ' sessions.connectionTime AS connection_time, sessions.disconnectTime AS disconnection_time,'
        + ' charging_stations.station_name AS station_name, sessions.charging_pointspoint_id AS point_id,'
        + ' sessions.protocol AS charging_protocol, sessions.kWhDelivered AS KWh_delivered,'
        + ' energy_providers.cost_per_kWh AS cost_per_KWh, sessions.cost AS cost'
        + ' FROM sessions,charging_points,charging_stations,energy_providers'
        + ' WHERE sessions.driven_byowner_id = ' + ownerid
        + ' AND sessions.connectionTime LIKE \'' + year + '-' + month + '%\''
        + ' AND sessions.charging_pointspoint_id = charging_points.point_id'
        + ' AND charging_points.charging_stationsstation_id = charging_stations.station_id'
        + ' AND charging_points.energy_providerenergy_provider_id = energy_providers.energy_provider_id', { type: sequelize.QueryTypes.SELECT })
        .then(rows => {

            chargeslist = rows;
            if (!chargeslist.length) {
                return res.status(402).json({ message: "No data found!" })
            }
            res.status(200).json({
                chargeslist: chargeslist
            })

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ message: "Internal server error." });
        })
}


exports.getAdminlist = (req, res, next) => {

    const administratorid = req.params.administratorid;
    const year = req.params.year;
    const month = req.params.month;

    if (!administratorid || !year || !month) return res.status(400).json({message: 'Some parameters are undefined'});

    sequelize.query('SELECT station_id, number_of_points, total_cost, total_engery_delivered, avg_rating'
        + ' FROM (SELECT station_id, COUNT(charging_points.point_id) AS number_of_points'
        + ' FROM charging_points, charging_stations'
        + ' WHERE charging_stations.station_id = charging_points.charging_stationsstation_id'
        + ' AND charging_stations.administrator_administrator_id = ' + administratorid
        + ' GROUP BY charging_stations.station_id) AS q1'
        + ' JOIN (SELECT charging_stations.station_id AS charging_station_id, SUM(sessions.cost) AS total_cost,'
        + ' SUM(sessions.kWhDelivered) AS total_engery_delivered, AVG(sessions.rating) AS avg_rating'
        + ' FROM sessions, charging_stations'
        + ' WHERE sessions.charging_pointscharging_stationsstation_id = charging_stations.station_id'
        + ' AND sessions.connectionTime LIKE \'' + year + '-' + month + '%\''
        + ' AND charging_stations.administrator_administrator_id = ' + administratorid
        + ' GROUP BY charging_stations.station_id) AS q2'
        + ' ON q1.station_id = q2.charging_station_id', { type: sequelize.QueryTypes.SELECT })
        .then(rows => {

            adminlist = rows;
            if (!adminlist.length) {
                return res.status(402).json({ message: "No data found!" })
            }

            let total_cost = 0;

            adminlist.forEach(element => {
                element.avg_rating = parseFloat(element.avg_rating).toFixed(1);
                total_cost += parseFloat(element.total_cost);
                element.pointMaintenanceCost = 25;
                element.pointCleaningCost = 10;
                element.employeeSalary = 150;
                element.totalEnergyCost = parseFloat((element.total_cost * 0.5).toFixed(2));
                element.operationalCost = parseFloat((element.number_of_points * (element.pointMaintenanceCost + element.pointCleaningCost + element.employeeSalary)).toFixed(2));
                element.totalStationProfit = (parseFloat(element.totalEnergyCost) - parseFloat(element.operationalCost)).toFixed(2);
            });

            res.status(200).json({
                total_cost: total_cost,
                adminlist: adminlist
            })

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ message: "Internal server error." });
        })
}