// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const Sequelize = require('sequelize');
const op = Sequelize.Op;

exports.postCompleted = (req, res, next) => {

    models.sessions.create({
        driven_byowner_id: req.body.owner_id,
        driven_byregistered_carslicense_plate: req.body.car_license_plate,
        charging_pointspoint_id: req.body.charging_point_id,
        charging_pointscharging_stationsstation_id: req.body.charging_station_id,
        connectionTime: req.body.connection_time,
        disconnectTime: req.body.disconnect_time,
        kWhDelivered: req.body.kWh_delivered,
        protocol: req.body.protocol,
        payment: req.body.payment,
        cost: req.body.cost,
        vehicle_type: req.body.vehicle_type,
        rating: null
    })
    .then(() =>{
        res.status(201).json({message: 'Sessions record created!'});
    })
    .catch(err => {
        return res.status(500).json({error: 'Internal server error.'})
    });

}

exports.getStations = (req, res, next) => {

    sequelize.query('SELECT charging_stations.station_id AS station_id, charging_stations.station_name AS station_name'
        + ' FROM charging_stations'
        + ' ORDER BY station_id', {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        StationList = rows;

        if (!StationList.length){
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(200).json({
            StationList: StationList
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getPoints = (req, res, next) => {

    const stationid = req.params.stationid;

    sequelize.query('SELECT charging_points.point_id AS point_id'
        + ' FROM charging_points'
        + ' WHERE charging_points.charging_stationsstation_id = ' + stationid
        + ' ORDER BY point_id' , {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        PointList = rows;
        if (!PointList.length){
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(200).json({
            PointList: PointList
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getLicenseplates = (req, res, next) => {

    const ownerid = req.params.ownerid;

    sequelize.query('SELECT driven_by.registered_carslicense_plate AS license_plate'
        + ' FROM driven_by'
        + ' WHERE driven_by.owner_id = ' + ownerid
        + ' ORDER BY license_plate' , {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        LicensePlateList = rows;
        if (!LicensePlateList.length){
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(200).json({
            LicensePlateList: LicensePlateList
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getownerid = (req, res, next) => {

    const username = req.params.username;

    sequelize.query('SELECT owners.owner_id AS owner_id'
        + ' FROM owners'
        + ' WHERE owners.email = \'' + username + '\'', {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        ownerid = rows[0];
        if (!ownerid){
            return res.status(402).json({ message: "No data found!" })
        }
        res.status(200).json({
            owner_id : ownerid.owner_id
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getVehicletype = (req, res, next) => {

    const licenseplate = req.params.licenseplate;

    sequelize.query('SELECT supported_cars.type AS vehicle_type'
        + ' FROM supported_cars,registered_cars'
        + ' WHERE supported_cars.id= registered_cars.supported_carsid'
        + ' AND registered_cars.license_plate = \'' + licenseplate + '\'', {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        vehicletype = rows[0];
        if (!vehicletype){
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(200).json({
            vehicletype: vehicletype.vehicle_type
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getCostperkwh = (req, res, next) => {

    const pointid = req.params.pointid;

    sequelize.query('SELECT energy_providers.cost_per_kWh AS cost_per_KWh'
        + ' FROM energy_providers,charging_points'
        + ' WHERE energy_providers.energy_provider_id = charging_points.energy_providerenergy_provider_id'
        + ' AND charging_points.point_id = ' + pointid, {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        costperkwh = rows[0];
        if (!costperkwh){
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(200).json({
            costperkwh: costperkwh.cost_per_KWh
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getCost = (req, res, next) => {

    const connectionTime = req.params.connectionTime;
    const disconnectiontime = req.params.disconnectiontime;
    const protocol = req.params.protocol;
    const costperkwh = req.params.costperkwh;
    
    if (connectionTime == undefined || disconnectiontime == undefined || protocol == undefined || costperkwh == undefined){
        return res.status(400).json({ message: "Some parameters are undefined" })
    }
    
    var chours = parseInt(connectionTime.slice(11,13));
    var dhours = parseInt(disconnectiontime.slice(11,13));   
    var cmins = parseInt(connectionTime.slice(14,16));
    var dmins = parseInt(disconnectiontime.slice(14,16));
    var ctime = chours + (cmins/60);
    var dtime = dhours + (dmins/60);

    if(dhours > chours)    var ttime = dtime - ctime;
    else                   var ttime = dtime + 24 - ctime;
    if(protocol == 'normal(20kW)'){
        var KWh_delivered = ttime * 20;
        var cost = KWh_delivered * parseFloat(costperkwh);
    } 
    else{
        var KWh_delivered = ttime * 50;
        var cost = KWh_delivered * parseFloat(costperkwh) * 1.2;
    }
        
    res.status(200).json({
        kWhDelivered: KWh_delivered.toFixed(3),
        cost: cost.toFixed(2)
    })


}

exports.getAdminstations = (req, res, next) => {

    const administratorid = req.params.administratorid;

    sequelize.query('SELECT charging_stations.station_id AS station_id, charging_stations.station_name AS station_name'
        + ' FROM charging_stations'
        + ' WHERE charging_stations.administrator_administrator_id = ' + administratorid
        + ' ORDER BY station_id' , {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        StationList = rows;
        if (!StationList.length){
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(200).json({
            StationList: StationList
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getAdminpoints = (req, res, next) => {

    const administratorid = req.params.administratorid;

    sequelize.query('SELECT charging_points.point_id AS point_id'
        + ' FROM charging_stations,charging_points'
        + ' WHERE charging_stations.station_id = charging_points.charging_stationsstation_id'
        + ' AND charging_stations.administrator_administrator_id = ' + administratorid
        + ' ORDER BY point_id' , {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        PointList = rows;
        if (!PointList.length){
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(200).json({
            PointList: PointList
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}

exports.getProviders = (req, res, next) => {

    sequelize.query('SELECT energy_provider_id, energy_provider_name'
        + ' FROM energy_providers'
        + ' ORDER BY energy_provider_id' , {type: sequelize.QueryTypes.SELECT})
    .then( rows => {

        ProviderList = rows;
        if (!ProviderList.length){
            return res.status(402).json({ message: "No data found!" })
        }

        res.status(200).json({
            ProviderList: ProviderList
        })

    })
    .catch (err => {
        console.log(err)
        return res.status(500).json({msg: "Internal server error."});
    })
}