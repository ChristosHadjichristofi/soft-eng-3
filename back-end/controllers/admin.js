// require libraries for validation, encrypting
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
// end of libraries validation, encrypting

// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
const { restart } = require('nodemon');
var models = initModels(sequelize);
// end of require models

exports.postUsermod = (req, res, next) => {

    const email = req.params.username;
    const password = req.params.password;
    const isAdministrator = req.query.isAdministrator;

    if (isAdministrator == 'true') {
        models.administrators.findOne({ where: { email: email } })
        .then (administratorUser => {       
            if (!administratorUser) {
                bcrypt.hash(password, 12).then(hashedPw => {
                    const newAdministratorUser = models.administrators.create({
                        name : req.body.name,
                        dob : req.body.dob,
                        street_name: req.body.street_name,
                        street_number : req.body.street_number,
                        postal_code : req.body.postal_code,
                        city : req.body.city,
                        phone_number : req.body.phone_number,
                        email : email,
                        password : hashedPw

                    });
                    
                    res.status(201).json({signup: 'true', message: 'Account created succesfully!'});
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
            }

            // Administrator user is already signed up and wants to change pw
            else {
                bcrypt.hash(password, 12).then(hashedPw => {
                    administratorUser.password = hashedPw;
                    administratorUser.save();
                })
                .then(result => {
                    res.status(201).json({change_password: 'true', message: 'Password changed succesfully!'});
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    }
    else {
        models.owners.findOne({ where: { email: email } })
        .then (ownerUser => {       
            if (!ownerUser) {
                bcrypt.hash(password, 12).then(hashedPw => {
                    const newOwnerUser = models.owners.create({
                        name : req.body.name,
                        dob : req.body.dob,
                        street_name: req.body.street_name,
                        street_number : req.body.street_number,
                        postal_code : req.body.postal_code,
                        city : req.body.city,
                        phone_number : req.body.phone_number,
                        email : email,
                        password : hashedPw

                    });
                    
                    res.status(201).json({signup: 'true', message: 'Account created succesfully!'});
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
            }

            // Owner user is already signed up and wants to change pw
            else {
                bcrypt.hash(password, 12).then(hashedPw => {
                    ownerUser.password = hashedPw;
                    ownerUser.save();
                })
                .then(result => {
                    res.status(201).json({change_password: 'true', message: 'Password changed succesfully!'});
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    }

}
    