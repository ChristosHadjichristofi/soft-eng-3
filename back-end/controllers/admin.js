// require libraries for validation, encrypting, jwt
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// end of libraries validation, encrypting, jwt

// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
const { restart } = require('nodemon');
const owner = require('../models/owner');
var models = initModels(sequelize);
// end of require models

exports.getHealthcheck = (req, res, next) => {

    sequelize.authenticate()
    .then(() => {
        res.status(200).json({status: "OK"});
    })
    .catch(err => {
        res.status(500).json({status: "FAILED"});
    })

}

exports.login = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    let loadedAdmin;
    models.system_admins.findOne({ where: {email: email} })
    .then(systemAdmin => {
        if (!systemAdmin) {
            res.status(401).json({error: 'This system admin account does not exist!'});
        }
        loadedAdmin = systemAdmin;
        return bcrypt.compare(password, systemAdmin.password);
    })
    .then (isEqual => {
        if (!isEqual) {
            res.status(401).json({error: 'Wrong password!'});
        }
        const token = jwt.sign(
            {
                email: loadedAdmin.email,
                userId: loadedAdmin.system_admin_id.toString()
            },
            'denthaseafisoumenatovreispotepotepote',
            { expiresIn: '1h' }
        );
        res.status(200).json({
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

exports.postUsermod = (req, res, next) => {

    // get dynamic parameters and query parameter
    const email = req.params.username;
    const password = req.params.password;
    const isAdministrator = req.query.isAdministrator;

    // if the user is administrator user
    if (isAdministrator == 'true') {
        // try get administrator from db
        models.administrators.findOne({ where: { email: email } })
        .then (administratorUser => {
            // if not exists must be created
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
        // try get owner from db
        models.owners.findOne({ where: { email: email } })
        .then (ownerUser => {
            // if owner doesnt exist
            if (!ownerUser) {
                // if not exists ins Owners must check if exists in Administrators
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