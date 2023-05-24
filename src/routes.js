const { Router } = require("express");
const UserController = require("./controllers/UserController");

const routes = Router();

routes.get("/", UserController.sayHi);
routes.post("/user/new", UserController.createUser);
routes.get("/users", UserController.fetchUsers);

module.exports = routes;
