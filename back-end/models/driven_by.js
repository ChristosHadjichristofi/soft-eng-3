const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('driven_by', {
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'owners',
        key: 'owner_id'
      }
    },
    registered_carslicense_plate: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'registered_cars',
        key: 'license_plate'
      }
    }
  }, {
    sequelize,
    tableName: 'driven_by',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "owner_id" },
          { name: "registered_carslicense_plate" },
        ]
      },
      {
        name: "owner_id_idx",
        using: "BTREE",
        fields: [
          { name: "owner_id" },
        ]
      },
      {
        name: "registered_carslecense_plate_idx",
        using: "BTREE",
        fields: [
          { name: "registered_carslicense_plate" },
        ]
      },
    ]
  });
};
