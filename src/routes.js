const { Router } = require("express");
const UserController = require("./controllers/UserController");
const { signup, login, updateUser, forgotPassword, resetPassword } = UserController;
const userAuth = require('./middlewares/UserAuth');

const routes = Router();

routes.post('/users/signup', userAuth.saveUser, signup);
routes.post('/users/login', login);
routes.put('/users/edit/:userHash', userAuth.protect, updateUser);
routes.post('/users/forgot_password', UserController.forgotPassword);
routes.post('/users/reset_password', UserController.resetPassword, resetPassword);

module.exports = routes;
