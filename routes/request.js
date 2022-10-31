const express = require("express");
const routes = express.Router();
const {
  requestRider,
  Allrequest,
  Arequest,
  editRequest,
  deleteRequest,
  AdminAllrequest,
  Newrequest,
  completedrequest,
  Usercompletedrequest,
  Useruncompletedrequest
} = require("../controllers/request");
const {verifyToken, verifyTokenAdmin} = require("../middlewares/verifyToken");

routes.route("/create").post(verifyToken, requestRider);
routes.route("/requests").get(verifyToken, Allrequest);
routes.route("/requests/status").get(verifyToken, Newrequest);
routes.route("/requests/completed").get(verifyTokenAdmin, completedrequest);
routes.route("/user/requests/completed").get(verifyToken, Usercompletedrequest);
routes.route("/user/requests/incompleted").get(verifyToken, Useruncompletedrequest);
routes.route("/admin/requests").get(verifyTokenAdmin, AdminAllrequest);
routes.route("/request/:id").get(verifyToken, Arequest).patch(verifyToken, editRequest).delete(verifyToken, deleteRequest);


module.exports = routes;
