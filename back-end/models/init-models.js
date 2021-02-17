var DataTypes = require("sequelize").DataTypes;
var _administrators = require("./administrator");
var _system_admins = require("./system_admin");
var _expired_tokens = require("./expired_tokens");
var _charging_points = require("./charging_point");
var _charging_stations = require("./charging_station");
var _driven_by = require("./driven_by");
var _energy_providers = require("./energy_provider");
var _owners = require("./owner");
var _registered_cars = require("./registered_car");
var _sessions = require("./session");
var _supported_cars = require("./supported_car");

function initModels(sequelize) {
  var administrators = _administrators(sequelize, DataTypes);
  var system_admins = _system_admins(sequelize, DataTypes);
  var expired_tokens = _expired_tokens(sequelize, DataTypes);
  var charging_points = _charging_points(sequelize, DataTypes);
  var charging_stations = _charging_stations(sequelize, DataTypes);
  var driven_by = _driven_by(sequelize, DataTypes);
  var energy_providers = _energy_providers(sequelize, DataTypes);
  var owners = _owners(sequelize, DataTypes);
  var registered_cars = _registered_cars(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);
  var supported_cars = _supported_cars(sequelize, DataTypes);

  registered_cars.belongsToMany(owners, { through: driven_by, foreignKey: "registered_carslicense_plate", otherKey: "owner_id" });
  owners.belongsToMany(registered_cars, { through: driven_by, foreignKey: "owner_id", otherKey: "registered_carslicense_plate" });
  charging_points.belongsTo(charging_stations, { foreignKey: "charging_stationsstation_id"});
  charging_stations.hasMany(charging_points, { foreignKey: "charging_stationsstation_id", onDelete: 'cascade', onUpdate: 'cascade'});
  charging_points.belongsTo(energy_providers, { foreignKey: "energy_providerenergy_provider_id"});
  energy_providers.hasMany(charging_points, { foreignKey: "energy_providerenergy_provider_id", onDelete: 'set null', onUpdate: 'cascade'});
  charging_stations.belongsTo(administrators, { foreignKey: "administrator_administrator_id"});
  administrators.hasMany(charging_stations, { foreignKey: "administrator_administrator_id", onDelete: 'set null', onUpdate: 'cascade'});
  driven_by.belongsTo(owners, { foreignKey: "owner_id"});
  owners.hasMany(driven_by, { foreignKey: "owner_id", onDelete: 'cascade', onUpdate: 'cascade'});
  driven_by.belongsTo(registered_cars, { foreignKey: "registered_carslicense_plate"});
  registered_cars.hasMany(driven_by, { foreignKey: "registered_carslicense_plate", onDelete: 'cascade', onUpdate: 'cascade'});
  registered_cars.belongsTo(supported_cars, { foreignKey: "supported_carsid"});
  supported_cars.hasMany(registered_cars, { foreignKey: "supported_carsid", onDelete: 'cascade', onUpdate: 'cascade'});
  sessions.belongsTo(charging_points, { foreignKey: "charging_pointscharging_stationsstation_id"});
  charging_points.hasMany(sessions, { foreignKey: "charging_pointscharging_stationsstation_id", onDelete: 'set null', onUpdate: 'set null'});
  sessions.belongsTo(charging_points, { foreignKey: "charging_pointspoint_id"});
  charging_points.hasMany(sessions, { foreignKey: "charging_pointspoint_id", onDelete: 'set null', onUpdate: 'set null'});
  sessions.belongsTo(driven_by, { foreignKey: "driven_byowner_id"});
  driven_by.hasMany(sessions, { foreignKey: "driven_byowner_id", onDelete: 'set null', onUpdate: 'set null'});
  sessions.belongsTo(driven_by, { foreignKey: "driven_byregistered_carslicense_plate"});
  driven_by.hasMany(sessions, { foreignKey: "driven_byregistered_carslicense_plate", onDelete: 'set null', onUpdate: 'set null'});

  return {
    administrators,
    system_admins,
    expired_tokens,
    charging_points,
    charging_stations,
    driven_by,
    energy_providers,
    owners,
    registered_cars,
    sessions,
    supported_cars,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
