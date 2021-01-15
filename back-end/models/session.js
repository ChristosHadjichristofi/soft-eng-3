const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('session', {
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    driven_byowner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'driven_by',
        key: 'owner_id'
      }
    },
    driven_byregistered_carslicense_plate: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: 'driven_by',
        key: 'registered_carslicense_plate'
      }
    },
    charging_pointspoint_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'charging_points',
        key: 'point_id'
      }
    },
    charging_pointscharging_stationsstation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'charging_points',
        key: 'charging_stationsstation_id'
      }
    },
    connectionTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    disconnectTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    kWhDelivered: {
      type: DataTypes.DECIMAL(8,3),
      allowNull: true
    },
    protocol: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    payment: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cost: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: true
    },
    vehicle_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sessions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "session_id" },
        ]
      },
      {
        name: "session_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "session_id" },
        ]
      },
      {
        name: "driven_byowner_id_idx",
        using: "BTREE",
        fields: [
          { name: "driven_byowner_id" },
        ]
      },
      {
        name: "driven_byregistered_carslicense_plate_idx",
        using: "BTREE",
        fields: [
          { name: "driven_byregistered_carslicense_plate" },
        ]
      },
      {
        name: "charging_pointspoint_id_idx",
        using: "BTREE",
        fields: [
          { name: "charging_pointspoint_id" },
        ]
      },
      {
        name: "charging_pointscharging_stationsstation_id_idx",
        using: "BTREE",
        fields: [
          { name: "charging_pointscharging_stationsstation_id" },
        ]
      },
    ]
  });
};
