const express = require("express");
const Rider = require("../models/Rider");
const User = require("../models/User")
// const bcrypt = require("bcryptjs");

// CREATE A RIDER
const createRider = async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')+ '/images/' + req.file.filename
  const reqFiles = url

  const emailExist = await Rider.findOne({ email: req.body.email });
  const driversLiscence = await Rider.findOne({
    driversLiscence: req.body.driversLiscence,
  });
  if (emailExist || driversLiscence) {
    res.status(409).json({
      success: false,
      message: "Creedencials Already Exist",
    });
  } else {
    const userId = req.user.id;
    const idUser = await User.findById(userId);
    const newRider = new Rider({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      driversLiscence: req.body.driversLiscence,
      phoneNumber: req.body.phoneNumber,
      createdBy: idUser,
      photo: reqFiles,
      // password : await bcrypt.hash(req.body.password, 10),
    });
    try {
      const rider = await newRider.save();
      if (!rider) {
        res.status(400).json({
          success: false,
          message: "Something Went Wrong Please Try again",
        });
      } else {
        res.status(200).json({ success: true, rider });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

//ADMIN  GET ALL FREE RIDERS
const freeRider = async (req, res) => {
  // const occupied = req.params.occupied;
  try {
    const freeRider = await Rider.find({ occupied: false });
    res.status(200).json({
      success: true,
      data: { freeRider, nbHits: freeRider.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL RIDER
const getallRider = async (req, res) => {
  try {
    const riders = await Rider.find().populate("createdBy")
    if (!riders) {
      res.status(400).json({
        success: false,
        message: "Something Went Wrong Please Try again",
      });
    } else {
      res
        .status(200)
        .json({ success: true, data: { riders, nbHits: riders.length } });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET A SINGLE RIDER
const getaRider = async (req, res) => {
  const id = req.params.id;
  try {
    const rider = await Rider.findById(id);
    if (!rider) {
      res.status(400).json({
        success: false,
        message: "Something Went Wrong Please Try again",
      });
    } else {
      res.status(200).json({ success: true, rider });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE A RIDER RECORD
const editRider = async (req, res) => {
  const id = req.params.id;
  try {
    const updateRider = await Rider.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateRider) {
      res.status(400).json({
        success: false,
        message: "Rider Record Not Updated, Please try Again",
      });
    } else {
      res.status(200).json({ success: true, updateRider });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE A RIDER
const deleteRider = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedRider = await Rider.findByIdAndDelete(id);
    if (!deletedRider) {
      res.status(400).json({
        success: false,
        message: "Rider Not Deleted, Please try Again",
      });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Rider Deleted Successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// USER STATS
const riderStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await Rider.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRider,
  getallRider,
  getaRider,
  editRider,
  deleteRider,
  riderStats,
  freeRider,
};
