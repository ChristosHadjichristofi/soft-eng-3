const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrator', {
    administrator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "password_UNIQUE"
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    street_name: {
      type: DataTypes.STRING(85),
      allowNull: true
    },
    street_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    postal_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'administrators',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "administrator_id" },
        ]
      },
      {
        name: "administrator_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "administrator_id" },
        ]
      },
      {
        name: "password_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "password" },
        ]
      },
    ]
  });
};
