const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(`postgres://miauadmin:531miau@miaudb:5432/miaudb`, {dialect: "postgres"})
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
