const mongoose = require("mongoose");

// ADD THE NECESSARY FILED
const requestSchema = mongoose.Schema({
  pickup: {
    type: String,
    required: [true, "Location is Requires"],
  },
  dropoff: {
    type: String,
    required: [true, "Distance is Requires"],
  },
  cargo: {
    type: Array,
    required: [true, "Cargo is Requires"],
  },
  rider: {
    type: mongoose.Types.ObjectId,
    ref: 'Rider',
    // default: 'None',
    // required: [true, "Riders is Requires"],
  },
  status: {
    type: Boolean,
    default: false,
  },
  requestedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, "Please Provide User"],
  },
  item: {
    type: String,
  }
}, {timestamps: true});

module.exports = mongoose.model('Request', requestSchema)
