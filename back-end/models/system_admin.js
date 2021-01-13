const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('system_admin', {
    system_admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'system_admins',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "system_admin_id" },
        ]
      },
      {
        name: "system_admin_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "system_admin_id" },
        ]
      },
    ]
  });
};
