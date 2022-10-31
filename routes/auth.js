const routes = require("express").Router()
const {registerUser, loginUser, logOut, verifyOTP, forgotPassword, changePass} = require("../controllers/auth")
// const {verifyToken, verifyTokenAdmin} = require("../middlewares/verifyToken");


routes.route("/register").post(registerUser)
routes.route("/verifyOtp/:id").post(verifyOTP)
// routes.route("/sendOTP").post(verifyToken, sendOTPVerificationEmail)
routes.route("/login").post(loginUser)
routes.route("/logout").post(logOut)
routes.route("/forgotPassword").post(forgotPassword)
routes.route("/changePass/:id").patch(changePass)

module.exports = routes