var DataTypes = require("sequelize").DataTypes;
var _administrator = require("./administrator");
var _charging_points = require("./charging_points");
var _charging_stations = require("./charging_stations");
var _driven_by = require("./driven_by");
var _energy_provider = require("./energy_provider");
var _owners = require("./owners");
var _registered_cars = require("./registered_cars");
var _sessions = require("./sessions");
var _supported_cars = require("./supported_cars");

function initModels(sequelize) {
  var administrator = _administrator(sequelize, DataTypes);
  var charging_points = _charging_points(sequelize, DataTypes);
  var charging_stations = _charging_stations(sequelize, DataTypes);
  var driven_by = _driven_by(sequelize, DataTypes);
  var energy_provider = _energy_provider(sequelize, DataTypes);
  var owners = _owners(sequelize, DataTypes);
  var registered_cars = _registered_cars(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);
  var supported_cars = _supported_cars(sequelize, DataTypes);

  registered_cars.belongsToMany(owners, { through: driven_by, foreignKey: "registered_carslicense_plate", otherKey: "owner_id" });
  owners.belongsToMany(registered_cars, { through: driven_by, foreignKey: "owner_id", otherKey: "registered_carslicense_plate" });
  charging_points.belongsTo(charging_stations, { foreignKey: "charging_stationsstation_id"});
  charging_stations.hasMany(charging_points, { foreignKey: "charging_stationsstation_id"});
  charging_points.belongsTo(energy_provider, { foreignKey: "energy_providerenergy_provider_id"});
  energy_provider.hasMany(charging_points, { foreignKey: "energy_providerenergy_provider_id"});
  charging_stations.belongsTo(administrator, { foreignKey: "administrator_administrator_id"});
  administrator.hasMany(charging_stations, { foreignKey: "administrator_administrator_id"});
  driven_by.belongsTo(owners, { foreignKey: "owner_id"});
  owners.hasMany(driven_by, { foreignKey: "owner_id"});
  driven_by.belongsTo(registered_cars, { foreignKey: "registered_carslicense_plate"});
  registered_cars.hasMany(driven_by, { foreignKey: "registered_carslicense_plate"});
  registered_cars.belongsTo(supported_cars, { foreignKey: "supported_carsid"});
  supported_cars.hasMany(registered_cars, { foreignKey: "supported_carsid"});
  sessions.belongsTo(charging_points, { foreignKey: "charging_pointscharging_stationsstation_id"});
  charging_points.hasMany(sessions, { foreignKey: "charging_pointscharging_stationsstation_id"});
  sessions.belongsTo(charging_points, { foreignKey: "charging_pointspoint_id"});
  charging_points.hasMany(sessions, { foreignKey: "charging_pointspoint_id"});
  sessions.belongsTo(driven_by, { foreignKey: "driven_byowner_id"});
  driven_by.hasMany(sessions, { foreignKey: "driven_byowner_id"});
  sessions.belongsTo(driven_by, { foreignKey: "driven_byregistered_carslicense_plate"});
  driven_by.hasMany(sessions, { foreignKey: "driven_byregistered_carslicense_plate"});

  return {
    administrator,
    charging_points,
    charging_stations,
    driven_by,
    energy_provider,
    owners,
    registered_cars,
    sessions,
    supported_cars,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
