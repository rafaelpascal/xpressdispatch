const mongoose = require("mongoose");

// ADD THE NECESSARY FILED
const riderSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Requires"],
      min: [10, "First Name Must not be less than 10 characters"],
      max: [100, "First Name Must not exceed 100 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Requires"],
      min: [10, "Last Name Must not be less than 10 characters"],
      max: [100, "Last Name Must not exceed 100 characters"],
    },
    driversLiscence: {
      type: String,
      required: [true, "Driver's Liscence is Requires"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Phone Number is Requires"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, "Please Provide User"],
    },
    occupied: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      required: [true, "Email is Requires"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: [true, "Email Already Exist"],
    },
    photo: {
      type: String,
      required: [true, "Provide Rider's Image"],
    },
    //   password: {
    //     type: String,
    //     required: [true, "must provide Password"],
    //   },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rider", riderSchema);
