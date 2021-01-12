const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('charging_point', {
    point_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    charging_stationsstation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'charging_stations',
        key: 'station_id'
      }
    },
    energy_providerenergy_provider_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'energy_providers',
        key: 'energy_provider_id'
      }
    }
  }, {
    sequelize,
    tableName: 'charging_points',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "point_id" },
          { name: "charging_stationsstation_id" },
        ]
      },
      {
        name: "charging_stationsstation_id_idx",
        using: "BTREE",
        fields: [
          { name: "charging_stationsstation_id" },
        ]
      },
      {
        name: "energy_providerenergy_provider_id_idx",
        using: "BTREE",
        fields: [
          { name: "energy_providerenergy_provider_id" },
        ]
      },
    ]
  });
};
