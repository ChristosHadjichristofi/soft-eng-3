const Sequelize = require('sequelize')

const sequelize = new Sequelize('soft-eng-3', 'root', 'soft-eng-3', {
    dialect: 'mysql',
    protocol: 'mysql',
    host: 'localhost',
    port: '3306',
});

sequelize.authenticate()
.then(() => {
    console.log("Success connecting to databse!");    
})
.catch(err => {
    console.error("Unable to connect to the database", err);
})

module.exports = sequelize;
