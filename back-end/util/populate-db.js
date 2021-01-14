const sequelize = require('./database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
const data_importer = require('./data_importer');

function populate() {
    
    data_importer("./data/administrators.csv", models.administrators, true)
    .then (function () {
        data_importer("./data/charging-stations.csv", models.charging_stations, false)
        .then (function () {
            data_importer("./data/owners.csv", models.owners, true)
            .then (function () {
                data_importer("./data/energy-providers.csv", models.energy_providers, false)
                .then (function() {
                    data_importer("./data/charging-points.csv", models.charging_points, false)
                })
            })
        })
    })
    
    
    

    

    // let drivenByPath = "./data/driven-by.csv";
    // data_importer(drivenByPath, models.driven_by);

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