require("dotenv").config();
const {Sequelize, DataTypes} = require('sequelize');


const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const databaseUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
console.log(databaseUrl)

const sequelize = new Sequelize(databaseUrl, {dialect: "postgres", dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}})

const db = {}

sequelize.authenticate().then(() => {
  console.log(`Database connected to miaudb`)
}).catch((err) => {
  console.log(err)
})

db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.users = require('../models/UserModel') (sequelize, DataTypes)

module.exports = { db };
