const express = require("express");
const Notification = require("../models/UserNotification");
const Rider = require("../models/Rider");
const Request = require("../models/Request");
const User = require("../models/User")
// CREATE NOTIFICATION
const createNotification = async (req, res) => {
  try {
    const riderId = req.body.rider;
    const userId = req.body.requestedBy;
    const requestId = req.body.request;
    const idRider = await Rider.findById(riderId);
    const idRequest = await Request.findById(requestId);
    const idUser = await User.findById(userId)
    // console.log(idUser);
    const newNotification = new Notification({
      rider: idRider,
      request: idRequest,
      requestedBy: idUser
    });
    const noti = await newNotification.save();
    res.status(200).json({
      success: true,
      data: { noti, nbHits: noti.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL NOTIFICATION
const getAllMyNotifation = async (req, res) => {
  try {
    const notifi = await Notification.find().populate("requestedBy").populate("rider")
      .populate("request");
    res.status(200).json({
      success: true,
      data: { notifi, nbHits: notifi.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
  const riderId = req.params;
  if (!riderId) {
    res
      .status(404)
      .json({ success: false, message: "Please provide the request Id" });
  } else {
    try {
      await Notification.findOneAndDelete(riderId);
      res.status(200).json({
        success: true,
        message: "Notification Deleted Successfully!"
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = {
  createNotification,
  getAllMyNotifation,
  deleteNotification,
};
