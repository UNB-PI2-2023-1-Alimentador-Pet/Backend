const { Router } = require("express");
const UserController = require("./controllers/UserController");
const {
  createSchedule, updateSchedule,
  deleteSchedule, getSchedules, sendSchedulesMQTT
} = require("./controllers/ScheduleController");
const { bindImageToHistory, createHistory, getHistories } = require("./controllers/HistoryController");
const { signup, login, updateUser } = UserController;
const userAuth = require('./middlewares/UserAuth');
const uploadImage = require('./middlewares/Upload');

const routes = Router();

routes.post('/users/signup', userAuth.saveUser, signup);
routes.post('/users/login', login);
routes.put('/users/edit/:userHash', userAuth.protect, updateUser);
routes.get('/schedules/:userHash', userAuth.protect, getSchedules);
routes.post('/schedules/new', userAuth.protect, createSchedule);
routes.put('/schedules/edit/:scheduleId', userAuth.protect, updateSchedule);
routes.delete('/schedules/delete/:scheduleId', userAuth.protect, deleteSchedule);
routes.post('/histories/new', userAuth.protect, createHistory);
routes.get('/histories/:userHash', userAuth.protect, getHistories);
routes.put('/histories/bind_image/:id', userAuth.protect, uploadImage.single('file'), bindImageToHistory);

module.exports = routes;
