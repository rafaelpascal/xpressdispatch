const express = require("express")
const routes = express.Router()
const { createNotification, getAllMyNotifation, deleteNotification } = require("../controllers/userNotification")

routes.route("/user").post(createNotification)
routes.route("/user/get").get(getAllMyNotifation)
routes.route("/:requestId").delete(deleteNotification)

module.exports = routes