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

    sequelize.query('SELECT SUM(sessions.kWhDelivered) AS total_energy_consumed, SUM(sessions.cost) AS total_cost'
        + ' FROM sessions'
        + ' WHERE sessions.driven_byowner_id = ' + ownerid
        + ' AND sessions.connectionTime LIKE \'' + year + '-' + month + '%\'', {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        costenergytotals = rows[0];
        if (!costenergytotals){
            return res.status(402).json({ message: "No data found!" })
        }
        res.status(200).json({
            total_energy_consumed : costenergytotals.total_energy_consumed,
            total_cost : costenergytotals.total_cost
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getChargeslist = (req, res, next) => {

    const ownerid = req.params.ownerid;
    const year = req.params.year;
    const month = req.params.month;

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
        + ' AND charging_points.energy_providerenergy_provider_id = energy_providers.energy_provider_id', {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        chargeslist = rows;
        if (!chargeslist.length){
            return res.status(402).json({ message: "No data found!" })
        }
        res.status(200).json({
            chargeslist: chargeslist
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}