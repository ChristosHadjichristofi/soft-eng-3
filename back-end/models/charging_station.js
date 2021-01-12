const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('charging_station', {
    station_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    administrator_administrator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'administrators',
        key: 'administrator_id'
      }
    },
    station_name: {
      type: DataTypes.STRING(55),
      allowNull: true,
      unique: "station_name_UNIQUE"
    },
    latitude: {
      type: DataTypes.DECIMAL(8,6),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'charging_stations',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "station_id" },
        ]
      },
      {
        name: "station_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "station_id" },
        ]
      },
      {
        name: "station_name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "station_name" },
        ]
      },
      {
        name: "administrator_administrator_id_idx",
        using: "BTREE",
        fields: [
          { name: "administrator_administrator_id" },
        ]
      },
    ]
  });
};
