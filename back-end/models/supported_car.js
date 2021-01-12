const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supported_car', {
    id: {
      type: DataTypes.CHAR(40),
      allowNull: false,
      primaryKey: true
    },
    brand: {
      type: DataTypes.CHAR(25),
      allowNull: true
    },
    type: {
      type: DataTypes.CHAR(5),
      allowNull: true
    },
    model: {
      type: DataTypes.CHAR(40),
      allowNull: true
    },
    release_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    variant: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    usable_battery_size: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: true
    },
    average_consumption: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'supported_cars',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
