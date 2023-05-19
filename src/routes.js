import { Router } from "express";
import UserController from "./controllers/UserController";

const routes = Router();

routes.get("/", UserController.sayHi);

export default routes;