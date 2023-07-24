const { Router } = require("express");
const {
  createSchedule, updateSchedule,
  deleteSchedule, getSchedules, optimizedSchedule,
  getSchedulesByFeeder,
  optimizedScheduleForAllPets,
  optimizedScheduleForMyPet,
  autoFeedInfo,
  receiveESPTopic
} = require("./controllers/ScheduleController");
const { bindImageToHistory, createHistory, getHistories, updateHistory } = require("./controllers/HistoryController");
const { signup, login, updateUser, forgotPassword, resetPassword } = require("./controllers/UserController");
const userAuth = require('./middlewares/UserAuth');
const uploadHistoryImage = require('./middlewares/UploadHistoryImage');
const uploadFeederImage = require('./middlewares/UploadFeederImage');
const uploadFeederAudio = require('./middlewares/UploadFeederAudio');
const { 
  createPetFeeder, getPetFeeders, 
  bindImageToFeeder, updatePetFeeder, 
  bindAudioToFeeder, getPetFeeder } = require("./controllers/PetFeederController");

const routes = Router();

routes.post('/users/signup', userAuth.saveUser, signup);
routes.post('/users/login', login);
routes.put('/users/edit/:userHash', userAuth.protect, updateUser);
routes.get('/schedules/:userHash', userAuth.protect, getSchedules);
routes.get('/schedules/find_by_feeder/:token', userAuth.protect, getSchedulesByFeeder);
routes.post('/schedules/new', userAuth.protect, createSchedule);
routes.put('/schedules/edit/:scheduleId', userAuth.protect, updateSchedule);
routes.delete('/schedules/delete/:scheduleId', userAuth.protect, deleteSchedule);
routes.post('/histories/new', createHistory);
routes.get('/histories/:userHash', getHistories);
routes.put('/histories/bind_image/:id', uploadHistoryImage.single('file'), bindImageToHistory);
routes.put('/histories/:id', updateHistory);
routes.post('/feeders/new', userAuth.protect, createPetFeeder);
routes.get('/feeders/:userHash', userAuth.protect, getPetFeeders);
routes.get('/feeder/:token', getPetFeeder);
routes.put('/feeders/bind_image/:token', userAuth.protect, uploadFeederImage.single('file'), bindImageToFeeder);
routes.put('/feeders/bind_audio/:token', userAuth.protect, uploadFeederAudio.single('file'), bindAudioToFeeder);
routes.put('/feeders/:token', userAuth.protect, updatePetFeeder);
routes.post("/users/forgot-password", forgotPassword);
routes.post("/users/reset-password", resetPassword);
routes.get('/optimized-schedule/all_pets', optimizedScheduleForAllPets);
routes.get('/optimized-schedule/my_pet/:userHash', optimizedScheduleForMyPet);
routes.post('/receive-feed-info', autoFeedInfo);
routes.post('/receive-ESP-topic', receiveESPTopic);

module.exports = routes;
