const { Router } = require("express");
const UserController = require("./controllers/UserController");
const {
  createSchedule, updateSchedule,
  deleteSchedule, getSchedules, sendSchedulesMQTT
} = require("./controllers/ScheduleController");
const { bindImage, createHistory } = require("./controllers/HistoryController");
const { signup, login, updateUser } = UserController;
const userAuth = require('./middlewares/UserAuth');

const routes = Router();

routes.post('/users/signup', userAuth.saveUser, signup);
routes.post('/users/login', login);
routes.put('/users/edit/:userHash', userAuth.protect, updateUser);
routes.get('/schedules/:userHash', userAuth.protect, getSchedules);
routes.post('/schedules/new', userAuth.protect, createSchedule);
routes.put('/schedules/edit/:scheduleId', userAuth.protect, updateSchedule);
routes.delete('/schedules/delete/:scheduleId', userAuth.protect, deleteSchedule);
routes.post('/histories/new', userAuth.protect, createHistory)
routes.put('/histories/bind_image/:id', userAuth.protect, bindImage);

module.exports = routes;
