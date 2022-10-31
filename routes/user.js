const routes = require("express").Router();
const {verifyToken, verifyTokenAdmin} = require("../middlewares/verifyToken");
const { getAllUser, getUser, deleteUser, editUser, userStats, findOneUser} = require("../controllers/user");
const upload = require("../middlewares/multer");


routes.route("/users").get(verifyToken, getAllUser);
routes.route("/user/email/:email").get(findOneUser);
routes.route("/stats").get(verifyToken, userStats);
routes
  .route("/users/:id")
  .get(getUser)
  .delete(verifyTokenAdmin, deleteUser).patch(verifyToken, upload.single('photo'), editUser);

module.exports = routes;
