const jwt = require('jsonwebtoken');

// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

module.exports = (req, res, next) => {
    const authHeader = req.header('X-OBSERVATORY-AUTH');
    if (!authHeader) {
        return res.status(401).json({message: 'Not authenticated.'});
    }
    const token = authHeader;

    if (token) {
        models.expired_tokens.findOne({ where: {token: token}})
        .then(expired => {
            if (expired) { return res.status(401).json({message: 'Invalid Token.'}) }
            else {
                let decodedToken;
                try {
                    decodedToken = jwt.verify(token, 'denthaseafisoumenatovreispotepotepote');
                } catch (err) {
                    return res.status(500).json({message: 'Internal server error.'});
                }
                if (!decodedToken) {
                    return res.status(401).json({message: 'Not authenticated.'});
                }
                
                req.user = decodedToken.user;
            
                next();
            }
        })
    }
    
};