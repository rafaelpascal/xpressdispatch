const routes = require("express").Router()
const {dashboard} = require("../controllers/admin")

routes.route("/getAll").get(dashboard)

module.exports = routes