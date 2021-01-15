const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('registered_car', {
    license_plate: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true
    },
    supported_carsid: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      references: {
        model: 'supported_cars',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'registered_cars',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "license_plate" },
        ]
      },
      {
        name: "supported_carsid_idx",
        using: "BTREE",
        fields: [
          { name: "supported_carsid" },
        ]
      },
    ]
  });
};
