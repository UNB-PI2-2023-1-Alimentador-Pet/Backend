const { Router } = require("express");
const UserController = require("./controllers/UserController");

const routes = Router();

routes.get("/", UserController.sayHi);
routes.post("/user/new", UserController.createUser)

module.exports = routes;