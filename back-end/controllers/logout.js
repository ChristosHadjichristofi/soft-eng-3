// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

module.exports = (req, res, next) => {
    let token = req.headers['x-observatory-auth'] || req.headers['authorization'];

        if (!token) {
            return res.json({
            success: false,
            message: 'Auth token is not supplied'
          })
        }
      
        if (token && !models.expired_tokens.findOne({ token: token })) {
            models.expired_tokens.create({ token: token })
            res.status(200).json({ message: "OK" });
        }
        else res.status(400).json({ message: "You are already logged out." })
}