const express = require("express");
const Request = require("../models/Request");
const User = require("../models/User");
const Rider = require("../models/Rider");

// CREATE REQUEST
const requestRider = async (req, res) => {
  const userId = req.user.id;
  // const riderId = req.user.id;
  const idUser = await User.findById(userId);
  // const idRider = await User.findById(userId);
  // req.body.rider = req.rider.id;
  const newRequest = new Request({
    pickup: req.body.pickup,
    dropoff: req.body.dropoff,
    cargo: req.body.cargo,
    rider: req.body.rider,
    status: req.body.status,
    requestedBy: idUser,
  });
  if (!newRequest) {
    res.status(400).json({
      success: false,
      message: "Failed, Please Provide the requested information",
    });
  } else {
    try {
      const createdRequest = await newRequest.save();
      res
        .status(200)
        .json({
          success: true,
          data: { createdRequest, nbHits: createdRequest.length },
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// GET ALL THE REQUEST
const Allrequest = async (req, res) => {
  const { status } = req.query;
  const queryObj = {};
  if (status) {
    queryObj.status = status === "true" ? true : false;
  }
  try {
    const requests = await Request.find({ requestedBy: req.user.id, status: false }).populate("requestedBy").populate("rider");
    res
      .status(200)
      .json({ success: true, data: { requests, nbHits: requests.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//ADMIN  GET ALL THE REQUEST
const AdminAllrequest = async (req, res) => {
  const { status } = req.query;
  const queryObj = {};
  if (status) {
    queryObj.status = status === "true" ? true : false;
  }
  try {
    const adminrequests = await Request.find({}).populate("requestedBy").populate("rider");
    res.status(200).json({
      success: true,
      data: { adminrequests, nbHits: adminrequests.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//ADMIN  GET ALL NEW REQUEST
const Newrequest = async (req, res) => {
  const status = req.params.status;
  try {
    const adminrequests = await Request.find({ status: false }).populate(
      "requestedBy"
    ).populate("rider");;
    res.status(200).json({
      success: true,
      data: { adminrequests, nbHits: adminrequests.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//ADMIN  GET ALL COMPLETED REQUEST
const completedrequest = async (req, res) => {
  const status = req.query.status;
  try {
    const adminCrequests = await Request.find({ status }).populate(
      "requestedBy"
    ).populate("rider");
    res.status(200).json({
      success: true,
      data: { adminCrequests, nbHits: adminCrequests.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//User  GET ALL COMPLETED REQUEST
const Usercompletedrequest = async (req, res) => {
  // const status = req.query.status;
  try {
    const userCrequests = await Request.find({status: true} , { requestedBy: req.user.id }).populate(
      "requestedBy"
    );
    res.status(200).json({
      success: true,
      data: { userCrequests, nbHits: userCrequests.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//User  GET ALL COMPLETED REQUEST
const Useruncompletedrequest = async (req, res) => {
  // const status = req.query.status;
  try {
    const userCrequests = await Request.find({status: false} , { requestedBy: req.user.id }).populate(
      "requestedBy"
    ).populate("rider");
    res.status(200).json({
      success: true,
      data: { userCrequests, nbHits: userCrequests.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET A SINGLE REQUEST
const Arequest = async (req, res) => {
  const {
    user: { id },
    params: { id: requestId },
  } = req;
  try {
    const request = await Request.findOne({ _id: requestId, requestedBy: id });
    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE A SINGLE REQUEST
const editRequest = async (req, res) => {
  const id = req.params.id;
  try {
    await Request.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ success: true, message: "Request Successfully Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE A REQUEST
const deleteRequest = async (req, res) => {
  const id = req.params.id;
  try {
    await Request.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Request Successfully Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  requestRider,
  Allrequest,
  Arequest,
  editRequest,
  deleteRequest,
  AdminAllrequest,
  Newrequest,
  completedrequest,
  Usercompletedrequest,
  Useruncompletedrequest,
};
