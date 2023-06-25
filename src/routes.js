const { Router } = require("express");
const UserController = require("./controllers/UserController");
const {
  createSchedule, updateSchedule,
  deleteSchedule, getSchedules
} = require("./controllers/ScheduleController");
const { signup, login, updateUser } = UserController;
const userAuth = require('./middlewares/UserAuth');

const routes = Router();

routes.post('/users/signup', userAuth.saveUser, signup);
routes.post('/users/login', login);
routes.put('/users/edit/:userHash', userAuth.protect, updateUser);
routes.get('/schedules/:userHash', userAuth.protect, getSchedules);
routes.post('/schedules/new', userAuth.protect, createSchedule);
routes.put('/schedules/edit/:userHash', userAuth.protect, updateSchedule);
routes.delete('/schedules/delete/:userHash', userAuth.protect, deleteSchedule);

module.exports = routes;
