const { Router } = require("express");
const UserController = require("./controllers/UserController");
const {
  createSchedule, updateSchedule,
  deleteSchedule, getSchedules,
  sendSchedulesMQTT
} = require("./controllers/ScheduleController");
const { signup, login, updateUser } = UserController;
const userAuth = require('./middlewares/UserAuth');

const routes = Router();

routes.post('/users/signup', userAuth.saveUser, signup);
routes.post('/users/login', login);
routes.put('/users/edit/:userHash', userAuth.protect, updateUser);
routes.post('/schedules/new', userAuth.protect, createSchedule);

module.exports = routes;
