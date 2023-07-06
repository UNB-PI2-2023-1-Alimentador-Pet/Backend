require("dotenv").config();
const {Sequelize, DataTypes} = require('sequelize');


const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const databaseUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
console.log(databaseUrl)

const PRODUCTION_DB_OPTIONS = {dialect: "postgres", dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}};

const DEVELOPMENT_DB_OPTIONS = {dialect: "postgres"};

const sequelize = new Sequelize(databaseUrl, PRODUCTION_DB_OPTIONS);

const db = {}

sequelize.authenticate().then(() => {
  console.log(`Database connected to miaudb`)
}).catch((err) => {
  console.log(err)
})

db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.users = require('../models/UserModel') (sequelize, DataTypes);
db.schedules = require('../models/ScheduleModel') (sequelize, DataTypes);
db.histories = require('../models/HistoryModel') (sequelize, DataTypes);
db.petfeeders = require('../models/PetFeederModel') (sequelize, DataTypes);

module.exports = { db };
