const { Router } = require("express");
const UserController = require("./controllers/UserController");
const {
  createSchedule, updateSchedule,
  deleteSchedule, getSchedules, sendSchedulesMQTT
} = require("./controllers/ScheduleController");
const { bindImageToHistory, createHistory, getHistories } = require("./controllers/HistoryController");
const { signup, login, updateUser } = UserController;
const userAuth = require('./middlewares/UserAuth');
const uploadHistoryImage = require('./middlewares/UploadHistoryImage');
const uploadFeederImage = require('./middlewares/UploadFeederImage');
const { createPetFeeder, getPetFeeders, bindImageToFeeder, updatePetFeeder } = require("./controllers/PetFeederController");

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
routes.put('/histories/bind_image/:id', userAuth.protect, uploadHistoryImage.single('file'), bindImageToHistory);
routes.post('/feeders/new', userAuth.protect, createPetFeeder);
routes.get('/feeders/:userHash', userAuth.protect, getPetFeeders);
routes.put('/feeders/bind_image/:token', userAuth.protect, uploadFeederImage.single('file'), bindImageToFeeder);
routes.put('/feeders/:token', userAuth.protect, updatePetFeeder);

module.exports = routes;
