const { Router } = require("express");
const UserController = require("./controllers/UserController");

const routes = Router();

routes.get("/", UserController.sayHi);

module.exports = routes;