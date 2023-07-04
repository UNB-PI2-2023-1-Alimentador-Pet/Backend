const { Router } = require("express");
const UserController = require("./controllers/UserController");
const { signup, login, updateUser, forgotPassword } = UserController;
const userAuth = require('./middlewares/UserAuth');

const routes = Router();

routes.post('/users/signup', userAuth.saveUser, signup);
routes.post('/users/login', login)
routes.put('/users/edit/:userHash', userAuth.protect, updateUser)
routes.post("/users/forgot-password", forgotPassword);


module.exports = routes;
