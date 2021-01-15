// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const Sequelize = require('sequelize')
const op = Sequelize.Op;

exports.getSessionsPerPoint = (req, res, next) => {

    var {pointID, yyyymmdd_from, yyyymmdd_to} = req.params;
    
    // set startDate and endDate to correct format so as query has right results
    var yyyymmdd_from = yyyymmdd_from.substring(0,4) + "-" + yyyymmdd_from.substring(4,6) + "-" + yyyymmdd_from.substring(6,8);
    var yyyymmdd_to = yyyymmdd_to.substring(0,4) + "-" + yyyymmdd_to.substring(4,6) + "-" + yyyymmdd_to.substring(6,8);
    
    startCorrectFormat = yyyymmdd_from + " 02:00:00";
    const startDate = new Date(startCorrectFormat);
    endCorrectFormat = yyyymmdd_to + " 01:59:59";
    var endDate = new Date(endCorrectFormat);
    endDate.setDate(endDate.getDate() + 1);
    // end of correct format
    
    var count, sessions;

    models.sessions.findAll({
        raw: true,
        where: {
            charging_pointspoint_id: pointID,
            connectionTime: {
                [op.between]: [startDate, endDate]
            }
        },
        order: [
            ['connectionTime', 'ASC'],
        ],
        attributes: [
            ['session_id','SessionID'],
            ['connectionTime','StartedOn'],
            ['disconnectTime','FinishedOn'],
            ['protocol','Protocol'],
            ['kWhDelivered','EnergyDelivered'],
            ['payment','Payment'],
            ['vehicle_type','VehicleType']
        ]
    })
    .then( rows => {

        sessions = rows;
        count = rows.length;

        if (count <= 0) {
            return res.status(404).json({ message: "No entries found!" })
        }
        else {
            console.log('ime dame !')
            return sequelize.query(
                'SELECT administrators.name FROM administrators,charging_stations,charging_points '
                + 'WHERE administrators.administrator_id = charging_stations.administrator_administrator_id '
                + 'AND charging_stations.station_id = charging_points.charging_stationsstation_id '
                + 'AND charging_points.point_id = ' + pointID, {type: sequelize.QueryTypes.SELECT})
        }
    })
    .then( PointOperator => {

        res.status(201).json({

            Point: pointID,
            PointOperator: PointOperator[0].name,
            RequestTimestamp: new Date(),
            PeriodFrom: yyyymmdd_from,
            PeriodTo: yyyymmdd_to,
            NumberOfChargingSessions: count,
            ChargingSessionsList: sessions

        })
    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })

}