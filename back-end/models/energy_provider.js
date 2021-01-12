const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('energy_provider', {
    energy_provider_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    energy_provider_name: {
      type: DataTypes.STRING(55),
      allowNull: true,
      unique: "energy_provider_name_UNIQUE"
    },
    cost_per_kWh: {
      type: DataTypes.DECIMAL(6,5),
      allowNull: true
    },
    PricePolicyRef: {
      type: DataTypes.STRING(55),
      allowNull: true,
      unique: "PricePolicyRef_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'energy_provider',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "energy_provider_id" },
        ]
      },
      {
        name: "energy_provider_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "energy_provider_id" },
        ]
      },
      {
        name: "energy_provider_name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "energy_provider_name" },
        ]
      },
      {
        name: "PricePolicyRef_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PricePolicyRef" },
        ]
      },
    ]
  });
};
