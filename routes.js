const { Router } = require("express");
const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");
const logger = require("./logger");
const verifyAuth = require("./services/AuthGuard");

const routes = Router();

routes.get("/", (req, res) => {
  res.json({ message: "JALS server is healthy." });
});

const ControllerHandler = (controller) => async (req, res) => {
  try {
    await controller(req, res);
  } catch (ex) {
    logger.error(ex.message);
    res.status(500).json({
      message: ex.message,
    });
  }
};

routes.post("/register", ControllerHandler(UserController.createUser));
routes.post("/login", ControllerHandler(AuthController.loginUser));
routes.post(
  "/refresh",
  verifyAuth("REFRESH"),
  ControllerHandler(AuthController.refreshToken)
);
routes.get(
  "/me",
  verifyAuth("ACCESS"),
  ControllerHandler(UserController.getProfile)
);

module.exports = routes;
