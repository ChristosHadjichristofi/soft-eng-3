const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');



var initModels = require("../models/init-models");
const owner = require('../models/owner');
var models = initModels(sequelize);



module.exports = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const isAdministrator = req.query.isAdministrator;
    // check for administrator
    if(isAdministrator == 'true'){
        models.administrators.findOne({ where: { email: email } })
            .then(administratorUser => {
                if(!administratorUser){
                    loadedUser = administratorUser;
                    return res.status(402).json({error:'A user with this email could not be found.'});
                }
                loadedUser = administratorUser;
                return bcrypt.compare(password, administratorUser.password);
            })
            .then(isEqual => {
                if (!loadedUser) return;
                if(!isEqual){
                    return res.status(401).json({error:'Wrong password!'});
                }
                const token = jwt.sign(
                    { user: {
                        administrator_id: loadedUser.administrator_id,
                        name: loadedUser.name,
                        email: loadedUser.email,
                        role: loadedUser.role
                    } },
                    'denthaseafisoumenatovreispotepotepote',
                    { expiresIn: '1h' }
                );
                res.status(200).json({ 
                    role: 'administrator', 
                    token: token
                });
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }
    // end check for administrator
    else{
        // check for car owner
        models.owners.findOne({ where: { email: email } })
            .then(ownerUser => {
                if(!ownerUser){
                    loadedUser = ownerUser;
                    return res.status(402).json({error:'A user with this email could not be found.'});
                }
                loadedUser = ownerUser;
                return bcrypt.compare(password, ownerUser.password);
            })
            .then(isEqual => {
                if (!loadedUser) return;
                if(!isEqual){
                    return res.status(401).json({error:'Wrong password!'});

                }
                const token = jwt.sign(
                    { user: {
                        owner_id: loadedUser.owner_id,
                        name: loadedUser.name,
                        email: loadedUser.email,
                        role: loadedUser.role
                    } },
                    'denthaseafisoumenatovreispotepotepote',
                    { expiresIn: '1h' }
                );
                res.status(200).json({ 
                    role: 'owner',
                    token: token
                });
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        //  end check for car owner
    }
};
