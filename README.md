# Software Engineering

This project was made for the course of Software engineering NTUA. We were asked to make a system for charging management of electrical vehicles. Because this is a very big application, we were asked to make specific functions of this system based on the number of people in the team.

## Technology Stack

* MySQL for the database
* NodeJS and Express for the server
* Angular for the front end

## Back-end

The backend folder contains:

* controllers: The logic of the routes.
* data: All data that is been loaded when server starts ( if in server.js you uncomment force:true and populate_db() )
* data_creators: All files that we used to create the data.
* middlewares: Files like authentication, authorization, upload.
* models: Created with the help of sequelize_auto. Those models represent the tables of the database.
* routes: All routes that are being used in the project. Each route starts with https://localhost:8765/evcharge/api/{service}, where {service} is each file in routes folder. Each service has certain endpoints.
* test: Contains the tests that were written in order to check all of our endpoints. Mocha and Chai were used for the testing.
* uploads: This folder is not in the control version, when you (locally) start the server, this folder is been created if it does not exist. In this folder all uploads are been uploaded.

### **To start the backend:**

First you need to write *npm install* if you didn't already. To start use the command *npm start*.

### **To test the backend:**

To run the tests use *npm test*.

## Cli-client

The cli-client folder contains:

* bin: Where the file that is been executed is. All commands are written in that file. For the creation of the commands *commander* was used.
* lib: This folder has some functions that help to construct the url to make the api call to the back-end, to handle some of the errors and show the right messages.
* src: Where all the functions that are been called when a specific command is used. Each of this .js files uses ./lib/constructURL to create the url and make the call.
* test: Contains the test that were written in order to check that constructURL behaves normally.

Cli-client commands:
* login right credentials: ev_group03 login --username admin --password petrol4ever
* login wrong credentials: ev_group03 login --username ad1mi1n --password petrol4ever
* spp: ev_group03 spp --point 1 --datefrom 20150505 --dateto 20200505 --format json
* sps: ev_group03 sps --station 1 --datefrom 20150505 --dateto 20200505 --format json
* spev: ev_group03 spev --ev ZXN4585 --datefrom 20150505 --dateto 20200505 --format json
* sppr: ev_group03 sppr --provider 1 --datefrom 20150505 --dateto 20200505 --format json
* reset sessions: ev_group03 resetsessions
* logout: ev_group03 logout
* mod user (if exists change pw, else create): ev_group03 adm --usermod -usr user9999 -pw password9999 -stAdm true  --> here stAdm is optional and is for modding a stationAdmin user
* find user: ev_group03 adm --users --username tester1@test.com -stAdm false
* sessions upd: ev_group03 adm --sessionsupd --source path/to/file.csv


### **To run any commands in the cli-client:**

First you need to write *npm install* if you didn't already. Next write *npm install -g*. Then you can use the commands that are been specified if you write **ev_group03**.

### **To test the cli-client (constructURL):**

To run the tests use *npm test*.

## Front-end

For the frontend Angular was used, so it has the folder hierarchy of an angular project. You can use the front end as a driver, or as a station admin. Each role has its own pages and can do certain tasks. For example the driver can make a charge session simulation, see an invoice of a specific month/year and see the sessions of one of his registered EVs for a specified time period. The driver can also use the maps and see the nearest stations.

The station admin can see sessions per station,point and provider for a specified time period. Also he can also see the invoice of a specific month/year.

For the front end to work properly, *guards* were used, so only an authorized user can reach the pages that he was supposed. Also 
*toastr* was used so as the errors were handled and show a relative message to the user of the system.

### **To run the front-end:**

First you need to write *npm install* if you didn't already. To start the front-end use *ng serve*.
