const express = require("express");
const Request = require("../models/Request");
const Rider = require("../models/Rider");
const User = require("../models/User");

const dashboard = async (req, res) => {
  // const { status } = req.query;
  // const queryObj = {}
  // if (status) {
  //   queryObj.status = status === "true" ? true : false
  // }
  try {
    const riders = await Rider.find({});
        res
      .status(200)
      .json({ success: true, data: { riders, nbHits: riders.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  try {
    const adminrequests = await Request.find();
    // res.status(200).json({ success: true, users });
    res.status(200).json({
      success: true,
      data: { adminrequests, nbHits: adminrequests.length },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, users });
    res.status(200).json({
      success: true,
      data: { adminrequests, nbHits: adminrequests.length },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { dashboard };
