const sequelize = require('./database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
const data_importer = require('./data_importer');

function populate() {
    
    // data_importer("./data/administrators.csv", models.administrators, true)
    // .then (function () {
    //     data_importer("./data/charging-stations.csv", models.charging_stations, false)
    //     .then (function () {
    //         data_importer("./data/owners.csv", models.owners, true)
    //         .then (function () {
    //             data_importer("./data/energy-providers.csv", models.energy_providers, false)
    //             .then (function() {
    //                 data_importer("./data/charging-points.csv", models.charging_points, false)
    //                 .then (function() {
    //                     data_importer("./data/supported-cars.csv", models.supported_cars, false)
    //                     .then (function() {
    //                         data_importer("./data/registered-cars.csv", models.registered_cars, false)
    //                         .then (function() {
    //                             data_importer("./data/driven-by.csv", models.driven_by, false)
    //                             .then (function() {
    //                                 data_importer("./data/sessions.csv", models.sessions, false)
    //                             })
    //                         })
    //                     })
    //                 })
    //             })
    //         })
    //     })
    // })

    data_importer("./data/administrators.csv", models.administrators, true)
    .then( () => {
        return data_importer("./data/charging-stations.csv", models.charging_stations, false)
    })
    . then( () => {
        return data_importer("./data/owners.csv", models.owners, true)
    })
    .then( () => {
        return data_importer("./data/energy-providers.csv", models.energy_providers, false)
    })
    .then( () => {
        return data_importer("./data/charging-points.csv", models.charging_points, false)
    })
    .then( () => {
        return data_importer("./data/supported-cars.csv", models.supported_cars, false)
    })
    .then( () => {
        return data_importer("./data/registered-cars.csv", models.registered_cars, false)
    })
    .then( () => {
        return data_importer("./data/driven-by.csv", models.driven_by, false)
    })
    // .then( () => {
    //     return data_importer("./data/sessions.csv", models.sessions, false)
    // })
    
    
    
    
    
    
    

}

module.exports = populate;