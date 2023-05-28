const { Router } = require("express");
const UserController = require("./controllers/UserController");

const routes = Router();

routes.post("/user/new", UserController.createUser);
routes.get("/users", UserController.fetchUsers);
routes.put("/user/edit/:user_hash", UserController.updateUser);

module.exports = routes;
