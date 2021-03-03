// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

var csv = require('csv-express')
const Sequelize = require('sequelize');
const op = Sequelize.Op;

exports.getSessionsPerPoint = (req, res, next) => {

    const format = req.query.format;

    var {pointID, yyyymmdd_from, yyyymmdd_to} = req.params;
    
    // set startDate and endDate to correct format so as query has right results
    var yyyymmdd_from = yyyymmdd_from.substring(0,4) + "-" + yyyymmdd_from.substring(4,6) + "-" + yyyymmdd_from.substring(6,8);
    var yyyymmdd_to = yyyymmdd_to.substring(0,4) + "-" + yyyymmdd_to.substring(4,6) + "-" + yyyymmdd_to.substring(6,8);
    
    startCorrectFormat = yyyymmdd_from + " 00:00:00";
    endCorrectFormat = yyyymmdd_to + " 23:59:59";
    // end of correct format

    var sessions;

    sequelize.query('SELECT row_number() OVER (ORDER BY session.connectionTime) SessionIndex, `session_id` AS `SessionID`, `connectionTime` AS `StartedOn`,'
    + '`disconnectTime` AS `FinishedOn`, `protocol` AS `Protocol`, `kWhDelivered` AS `EnergyDelivered`, `payment` AS `Payment`, `vehicle_type`'
    + 'AS `VehicleType` FROM `sessions` AS `session` WHERE `session`.`charging_pointspoint_id` = ' + pointID 
    + ' AND session.connectionTime BETWEEN \'' + startCorrectFormat + '\' AND \'' + endCorrectFormat + '\'' 
    + ' ORDER BY `session`.`connectionTime` ASC', {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        sessions = rows;
        count = rows.length;
        if (count <= 0) {
            return ;
        }
        else {
            return sequelize.query(
                'SELECT administrators.name FROM administrators,charging_stations,charging_points '
                + 'WHERE administrators.administrator_id = charging_stations.administrator_administrator_id '
                + 'AND charging_stations.station_id = charging_points.charging_stationsstation_id '
                + 'AND charging_points.point_id = ' + pointID, {type: sequelize.QueryTypes.SELECT})
        }
    })
    .then( PointOperator => {

        if (!PointOperator){
            return res.status(402).json({ message: "No data found!" })
        }
        
        if (format == 'csv') {
            var updatedSession;
            var sessionsArr = [];
            sessions.forEach(session => {
                updatedSession = {
                    Point: pointID, 
                    PointOperator: PointOperator[0].name,
                    RequestTimestamp: new Date(),
                    PeriodFrom: yyyymmdd_from,
                    PeriodTo: yyyymmdd_to,
                    NumberOfChargingSessions: count,
                    ...session
                }
                sessionsArr.push(updatedSession);
            })
            res.csv(sessionsArr, 200);
        }
        else {
            res.status(200).json({
                Point: pointID,
                PointOperator: PointOperator[0].name,
                RequestTimestamp: new Date(),
                PeriodFrom: yyyymmdd_from,
                PeriodTo: yyyymmdd_to,
                NumberOfChargingSessions: count,
                ChargingSessionsList: sessions
            })
        }        
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getSessionsPerStation = (req, res, next) => {

    const format = req.query.format;

    var {stationID, yyyymmdd_from, yyyymmdd_to} = req.params;
    
    // set startDate and endDate to correct format so as query has right results
    var yyyymmdd_from = yyyymmdd_from.substring(0,4) + "-" + yyyymmdd_from.substring(4,6) + "-" + yyyymmdd_from.substring(6,8);
    var yyyymmdd_to = yyyymmdd_to.substring(0,4) + "-" + yyyymmdd_to.substring(4,6) + "-" + yyyymmdd_to.substring(6,8);
    
    startCorrectFormat = yyyymmdd_from + " 02:00:00";
    const startDate = new Date(startCorrectFormat);
    endCorrectFormat = yyyymmdd_to + " 01:59:59";
    var endDate = new Date(endCorrectFormat);
    endDate.setDate(endDate.getDate() + 1);
    // end of correct format

    var Operator;
    var SessionsSummaryList;
    var NumberOfActivePoints;
    var TotalEnergyDelivered = 0;
    var NumberOfChargingSessions = 0;

    sequelize.query(
        'SELECT administrators.name FROM administrators,charging_stations '
        + 'WHERE administrators.administrator_id = charging_stations.administrator_administrator_id '
        + 'AND charging_stations.station_id = ' + stationID, {type: sequelize.QueryTypes.SELECT})
    .then ( stationOperator => {

        if (stationOperator.length == 0) {
            return ;
        }

        Operator = stationOperator[0].name;
        
        return models.sessions.findAll({
            raw: true,
            where: {
                charging_pointscharging_stationsstation_id: stationID,
                connectionTime: {
                    [op.between]: [startDate, endDate]
                }
            },
            group: ['charging_pointspoint_id'],
            order: [
                ['charging_pointspoint_id', 'ASC'],
            ],
            attributes: [
                ['charging_pointspoint_id','PointID'],
                [sequelize.fn('COUNT', sequelize.col('charging_pointspoint_id')), 'PointSessions'],
                [sequelize.fn('SUM', sequelize.col('kWhDelivered')), 'EnergyDelivered'],
            ]
        })
    })
    .then ( rows => {

        if (!rows) {
            return res.status(402).json({ message: "No data found!" })
        }
        SessionsSummaryList = rows;
        NumberOfActivePoints = rows.length;

        rows.forEach(x => {
            TotalEnergyDelivered += parseFloat(x.EnergyDelivered);
            NumberOfChargingSessions += x.PointSessions;
        });

        if (format == 'csv') {
            var updSessionSummary;
            var SessionsSummaryArr = [];
            SessionsSummaryList.forEach(sessionSummary => {
                updSessionSummary = {
                    StationID: stationID,
                    Operator: Operator,
                    RequestTimestamp: new Date(),
                    PeriodFrom: yyyymmdd_from,
                    PeriodTo: yyyymmdd_to,
                    TotalEnergyDelivered: TotalEnergyDelivered.toFixed(2),
                    NumberOfChargingSessions: NumberOfChargingSessions,
                    NumberOfActivePoints: NumberOfActivePoints,
                    ...sessionSummary
                }
                SessionsSummaryArr.push(updSessionSummary);
            })
            res.csv(SessionsSummaryArr, 200);
        }
        else {
            res.status(200).json({
                StationID: stationID,
                Operator: Operator,
                RequestTimestamp: new Date(),
                PeriodFrom: yyyymmdd_from,
                PeriodTo: yyyymmdd_to,
                TotalEnergyDelivered: TotalEnergyDelivered.toFixed(2),
                NumberOfChargingSessions: NumberOfChargingSessions,
                NumberOfActivePoints: NumberOfActivePoints,
                SessionsSummaryList: SessionsSummaryList
            })
        }
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getSessionsPerEV = (req, res, next) => {

    const format = req.query.format;

    var {vehicleID, yyyymmdd_from, yyyymmdd_to} = req.params;
    
    // set startDate and endDate to correct format so as query has right results
    var yyyymmdd_from = yyyymmdd_from.substring(0,4) + "-" + yyyymmdd_from.substring(4,6) + "-" + yyyymmdd_from.substring(6,8);
    var yyyymmdd_to = yyyymmdd_to.substring(0,4) + "-" + yyyymmdd_to.substring(4,6) + "-" + yyyymmdd_to.substring(6,8);
    
    startCorrectFormat = yyyymmdd_from + " 00:00:00";
    endCorrectFormat = yyyymmdd_to + " 23:59:59";
    // end of correct format

    var VehicleChargingSessionsList;
    var NumberOfVehicleChargingSessions;
    var NumberOfVisitedPoints;
    var TotalEnergyConsumed = 0;

    sequelize.query( 'SELECT @n := @n + 1 SessionIndex,'
        + 'sessions.session_id as SessionID, energy_providers.energy_provider_name as EnergyProvider,'
        + 'sessions.connectionTime as StartedOn, sessions.disconnectTime as FinishedOn,'
        + 'sessions.kWhDelivered as EnergyDelivered, energy_providers.PricePolicyRef as PricePolicyRef,'
        + 'energy_providers.cost_per_kWh as CostPerKWh, sessions.cost as SessionCost '
        + 'FROM sessions,charging_points,energy_providers,(SELECT @n := 0) m '
        + 'WHERE sessions.charging_pointspoint_id = charging_points.point_id '
        + 'AND charging_points.energy_providerenergy_provider_id = energy_providers.energy_provider_id '
        + 'AND sessions.connectionTime BETWEEN \'' + startCorrectFormat + '\' AND \'' + endCorrectFormat + '\'' 
        + ' AND sessions.driven_byregistered_carslicense_plate = \'' + vehicleID + '\''
        + ' ORDER BY  sessions.connectionTime', {type: sequelize.QueryTypes.SELECT})
    
    .then( rows => {

        NumberOfVehicleChargingSessions = rows.length;

        if (NumberOfVehicleChargingSessions == 0) return;

        VehicleChargingSessionsList = rows;

        return sequelize.query('SELECT COUNT(*) AS visitedPoints FROM ('
            + 'SELECT COUNT(sessions.charging_pointspoint_id) '
            + 'FROM sessions,charging_points,energy_providers '
            + 'WHERE sessions.charging_pointspoint_id = charging_points.point_id '
            + 'AND charging_points.energy_providerenergy_provider_id = energy_providers.energy_provider_id '
            + 'AND sessions.connectionTime BETWEEN \'' + startCorrectFormat + '\' AND \'' + endCorrectFormat + '\'' 
            + ' AND sessions.driven_byregistered_carslicense_plate = \'' + vehicleID + '\''
            + ' GROUP BY sessions.charging_pointspoint_id '
            + ') NumberOfVisitedPoints', {type: sequelize.QueryTypes.SELECT})
    })
    .then( ans => {

        if (!ans) {
            return res.status(402).json({ message: "No data found!" })
        }

        NumberOfVisitedPoints = ans[0].visitedPoints;

        VehicleChargingSessionsList.forEach(x => {
            TotalEnergyConsumed += parseFloat(x.EnergyDelivered);
            console.log(x);
        });

        if (format == 'csv') {
            var updVehicleChargingSession;
            var VehicleChargingSessionsArr = [];
            VehicleChargingSessionsList.forEach(vehicleChargingSession => {
                updVehicleChargingSession = {
                    VehicleID: vehicleID,
                    RequestTimestamp: new Date(),
                    PeriodFrom: yyyymmdd_from,
                    PeriodTo: yyyymmdd_to,
                    TotalEnergyConsumed: TotalEnergyConsumed + 'KWh',
                    NumberOfVisitedPoints: NumberOfVisitedPoints,
                    NumberOfVehicleChargingSessions: NumberOfVehicleChargingSessions,
                    ...vehicleChargingSession
                }
                VehicleChargingSessionsArr.push(updVehicleChargingSession);
            })
            res.csv(VehicleChargingSessionsArr, 200);
        }
        else {
            res.status(200).json({
                VehicleID: vehicleID,
                RequestTimestamp: new Date(),
                PeriodFrom: yyyymmdd_from,
                PeriodTo: yyyymmdd_to,
                TotalEnergyConsumed: TotalEnergyConsumed + 'KWh',
                NumberOfVisitedPoints: NumberOfVisitedPoints,
                NumberOfVehicleChargingSessions: NumberOfVehicleChargingSessions,
                VehicleChargingSessionsList: VehicleChargingSessionsList
            })
        }
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getSessionsPerProvider = (req, res, next) => {

    const format = req.query.format;

    var {providerID, yyyymmdd_from, yyyymmdd_to} = req.params;
    
    // set startDate and endDate to correct format so as query has right results
    var yyyymmdd_from = yyyymmdd_from.substring(0,4) + "-" + yyyymmdd_from.substring(4,6) + "-" + yyyymmdd_from.substring(6,8);
    var yyyymmdd_to = yyyymmdd_to.substring(0,4) + "-" + yyyymmdd_to.substring(4,6) + "-" + yyyymmdd_to.substring(6,8);
    
    startCorrectFormat = yyyymmdd_from + " 00:00:00";
    endCorrectFormat = yyyymmdd_to + " 23:59:59";
    // end of correct format

    var NumberOfProviderChargingSessions;
    var ProviderChargingSessionsList;
    var TotalCost = 0;

    sequelize.query('SELECT row_number() OVER (ORDER BY sessions.connectionTime) SessionIndex,'
        + 'sessions.charging_pointscharging_stationsstation_id as StationID,sessions.session_id as SessionID,' 
        + 'sessions.driven_byregistered_carslicense_plate as VehicleID,'
        + 'sessions.connectionTime as StartedOn, sessions.disconnectTime as FinishedOn,'
        + 'sessions.kWhDelivered as EnergyDelivered, energy_providers.PricePolicyRef as PricePolicyRef, '
        + 'energy_providers.cost_per_kWh as CostPerKWh, sessions.cost as sessionCost'
        + ' FROM sessions,charging_points,energy_providers'
        + ' WHERE sessions.charging_pointspoint_id = charging_points.point_id'
        + ' AND charging_points.energy_providerenergy_provider_id = energy_providers.energy_provider_id'
        + ' AND energy_providers.energy_provider_id = ' + providerID
        + ' AND sessions.connectionTime BETWEEN \'' + startCorrectFormat + '\' AND \'' + endCorrectFormat + '\''
        + ' ORDER BY  sessions.connectionTime', {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        NumberOfProviderChargingSessions = rows.length;

        if (NumberOfProviderChargingSessions == 0) return;

        ProviderChargingSessionsList = rows;

        return models.energy_providers.findOne({
            where: {
                energy_provider_id: providerID
            }
        })

    })
    .then (ProviderName => {

        if (!ProviderName){
            return res.status(402).json({ message: "No data found!" })
        }

        ProviderChargingSessionsList.forEach(x => {
            TotalCost += parseFloat(x.sessionCost);
        });

        if (format == 'csv') {
            var updProviderChargingSession;
            var ProviderChargingSessionsArr = [];
            ProviderChargingSessionsList.forEach(ProviderChargingSession => {
                updProviderChargingSession = {
                    ProviderID: providerID,
                    ProviderName: ProviderName.energy_provider_name,
                    RequestTimestamp: new Date(),
                    PeriodFrom: yyyymmdd_from,
                    PeriodTo: yyyymmdd_to,
                    NumberOfProviderChargingSessions: NumberOfProviderChargingSessions,
                    TotalCost: TotalCost.toFixed(2),
                    ...ProviderChargingSession
                }
                ProviderChargingSessionsArr.push(updProviderChargingSession);
            })
            res.csv(ProviderChargingSessionsArr, 200);
        }
        else {
            res.status(200).json({
                ProviderID: providerID,
                ProviderName: ProviderName.energy_provider_name,
                RequestTimestamp: new Date(),
                PeriodFrom: yyyymmdd_from,
                PeriodTo: yyyymmdd_to,
                NumberOfProviderChargingSessions: NumberOfProviderChargingSessions,
                TotalCost: TotalCost.toFixed(2),
                ProviderChargingSessionsList: ProviderChargingSessionsList
            })
        }
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}