const sequelize = require('./database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
const data_importer = require('./data_importer');

function populate() {
    
    let admininstratorsPath = "./data/administrators.csv";
    data_importer(admininstratorsPath, models.administrators, true);
    // let chargingPointsPath = "./data/charging-points.csv";
    // data_importer(chargingPointsPath, models.charging_points);
    // let chargingStationsPath = "./data/charging-stations.csv";
    // data_importer(chargingStationsPath, models.charging_stations);
    // let drivenByPath = "./data/driven-by.csv";
    // data_importer(drivenByPath, models.driven_by);
    // let energyProviderPath = "./data/energy-providers.csv";
    // data_importer(energyProviderPath, models.energy_providers);
    // let ownersPath = "./data/owners.csv";
    // data_importer(ownersPath, models.owners);
    // let registeredCarsPath = "./data/registered-cars.csv";
    // data_importer(registeredCarsPath, models.registered_cars);
    // let sessionsPath = "./data/sessions.csv";
    // data_importer(sessionsPath, models.sessions);
    // let supportedCarsPath = "./data/supported-cars.csv";
    // data_importer(supportedCarsPath, models.supported_cars);

}

module.exports = populate;