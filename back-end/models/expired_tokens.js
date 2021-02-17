const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('expired_token', {
        tokenId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
      }, {
        sequelize,
        tableName: 'expired_tokens',
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "tokenId" },
            ]
          },
          {
            name: "tokenId_UNIQUE",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "tokenId" },
            ]
          },
        ]
    });
};