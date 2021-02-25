// require libraries for validation, encrypting, jwt
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// end of libraries validation, encrypting, jwt

// require models
const sequelize = require('../util/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const fs = require("fs");
const csv = require("fast-csv");

exports.postResetsessions = (req, res, next) => {

    const adminPw = "$2y$12$3hLJswSlH3RHShXDwXuH/OQU98hFYcTbA7xqOlKQKuYkX8yYYKaMC"

    models.system_admins.findOne({ where: {username: "admin"} })
    .then(system_admin => {
        if (!system_admin) {
            models.system_admins.create({
                username : "admin",
                password : adminPw
            })
            .then (
                sequelize.query('TRUNCATE TABLE ' + '`sessions`')
                .then(() => {
                    return res.status(200).json({status: "OK"});
                })
                .catch(err => {
                return res.status(500).json({status: "FAILED"});
                })
            )
            .catch (err => {
                return res.status(500).json({status: "FAILED"});
            })   
        }
        else {
            system_admin.password = adminPw;
            system_admin
            .save()
            .then (
                sequelize.query('TRUNCATE TABLE ' + '`sessions`')
                .then(() => {
                    return res.status(200).json({status: "OK"});
                })
                .catch(err => {
                return res.status(500).json({status: "FAILED"});
                })
            )
            .catch (err => {
                return res.status(500).json({status: "FAILED"});
            })  
        }
    }).catch (err => {
        return res.status(500).json({status: "FAILED"});
    })  
    
}

exports.getUser = (req, res, next) => {

    const email = req.params.username;
    const isAdministrator = req.query.isAdministrator;

    if (isAdministrator == 'true') {

        models.administrators.findOne({ where: {email: email} })
        .then(administratorDoc => {
            if (!administratorDoc) {
                return res.status(402).json({error: 'User was not found!'});
            }
            res.send(administratorDoc);
        })
        .catch(err => {
            return res.status(500).json({error: 'Internal server error.'})
        })
    }
    else {
        models.owners.findOne({ where: {email: email} })
        .then(ownerDoc => {
            if (!ownerDoc) {
                return res.status(402).json({error: 'User was not found!'});
            }
            res.send(ownerDoc);
        })
        .catch(err => {
            return res.status(500).json({error: 'Internal server error.'})
        })
    }
}

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

    const username = req.body.username;
    const password = req.body.password;
    let loadedAdmin;
    models.system_admins.findOne({ where: {username: username} })
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
            { user: loadedAdmin },
            'denthaseafisoumenatovreispotepotepote',
            { expiresIn: '1h' }
        );
        res.status(200).json({
            token: token
        });
    })
    .catch(err => {
        return res.status(500).json({error: 'Internal server error.'})
    });
}

exports.postUsermod = (req, res, next) => {

    // get dynamic parameters and query parameter
    const email = req.params.username;
    const password = req.params.password;
    const isAdministrator = req.query.isAdministrator;

    // if the user is administrator user
    if (isAdministrator === 'true') {
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
                    return res.status(500).json({error: 'Internal server error.'})
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
                    return res.status(500).json({error: 'Internal server error.'})
                });
            }
        })
        .catch(err => {
            return res.status(500).json({error: 'Internal server error.'})
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
                    return res.status(500).json({error: 'Internal server error.'})
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
                    return res.status(500).json({error: 'Internal server error.'})
                });
            }
        })
        .catch(err => {
            return res.status(500).json({error: 'Internal server error.'})
        });
    }
}

exports.postSystem = (req, res) => {

    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }
  
        let sessions = [];
        var fail = 0;
        let path = __dirname + "/../uploads/" + req.file.filename;
        
        fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
            throw error.message;
        })
        .on("data", (row) => {
            if (row.driven_byowner_id == '' || row.driven_byregistered_carslicense_plate == '' || 
                row.charging_pointspoint_id == '' || row.charging_pointscharging_stationsstation_id == '' || 
                row.connectionTime == '' || row.disconnectTime == '' || row.kWhDelivered == '' || 
                row.protocol == '' || row.payment == '' || row.cost == '' || row.vehicle_type == '' || row.rating == '') {
                    fail = fail + 1;
                }
            else {
                if (row.rating == 'NULL') {
                    row.rating = null;
                }
                sessions.push(row);
            }
        })
        .on("end", () => {
            models.sessions.bulkCreate(sessions)
            .then(() => {
                return models.sessions.count();
            })
            .then(totalSessions => {
                res.status(200).send({
                    SessionsInUploadedFile: sessions.length + fail,
                    SessionsImported: sessions.length,
                    TotalSessionsInDatabase: totalSessions
                });
            })
            .catch((error) => {
                res.status(500).send({ 
                    message: "Fail to import data into database!",
                    error: error.message
                });
            });
            
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};