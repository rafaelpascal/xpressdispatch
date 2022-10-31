const routes = require("express").Router();
const {verifyToken, verifyTokenAdmin} = require("../middlewares/verifyToken");
const { createRider, getaRider, getallRider, editRider, deleteRider, riderStats, freeRider} = require("../controllers/rider");
const upload = require("../middlewares/multer");

routes.route("/rider").post(upload.single('photo'), verifyTokenAdmin, createRider).get(verifyToken, getallRider);
routes.route("/stats").get(verifyTokenAdmin, riderStats);
routes.route("/free").get(verifyTokenAdmin, freeRider);
routes.route("/rider/:id").get(getaRider).patch(upload.array('photo', 3), verifyToken, editRider).delete(verifyTokenAdmin, deleteRider)

module.exports = routes;
