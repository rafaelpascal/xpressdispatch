const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/User");
require("dotenv").config();

let transporter = nodemailer.createTransport({
    service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

var mailOptions = {
  from: process.env.EMAIL,
  to: User.email,
  subject: "Password by Xpress Riders Management System",
  html:
    "<p><b>Your Login Details for Xpress Riders Management System</b><br><b>Email:</b>" +
    User.email + "<br><b>Password: </b> " +
    User.password +
    ' <br><a href="http://localhost:4200/">Click here to login</a> </p>',
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});

module.exports = nodemailer;
