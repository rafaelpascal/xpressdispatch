const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET ALL REGISTERED USERS
const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(400).json({
        success: false,
        message: "Something Went Wrong Please Try Again",
      });
    } else {
      // res.status(200).json({ success: true, users });
    res.status(200).json({ success: true, data: {users, nbHits: users.length }});
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET A SINGLE USER USING ID
const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not Found",
      });
    } else {
      res.status(200).json({ success: true, user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET A SINGLE USER USING EMAIL
const findOneUser = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({email});
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not Found",
      });
    } else {
      res.status(200).json({ success: true, user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE USER
const editUser = async (req, res) => {
  const url = req.protocol + '://' + req.get('host')+ '/images/' + req.file.filename
  const reqFiles = url
  const id = req.params.id;
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  const updateUser = ({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    photo: reqFiles,
    // password : await bcrypt.hash(req.body.password, 10),
  });
  try {
    const user = await User.findByIdAndUpdate(id, updateUser, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(500).json({
        success: false,
        message: "User Not Updated Please try Again",
      });
    } else {
      res.status(200).json({ success: true, user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// USER STATS
const userStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  console.log(lastYear);
  try {
    const data = await User.aggregate([
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
      res.status(200).json({success:true, data})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUser,
  getUser,
  deleteUser,
  editUser,
  userStats,
  findOneUser,
};
