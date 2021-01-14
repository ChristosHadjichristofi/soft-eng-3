const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrator', {
    administrator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    street_name: {
      type: DataTypes.STRING(85),
      allowNull: false
    },
    street_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postal_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
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
        name: "email_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
