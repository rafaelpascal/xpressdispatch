const mongoose = require("mongoose");

const userOTPSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});

// userOTPSchema.pre("save", async function () {
//     this.otp = await bcrypt.hash(this.otp, 10);
//   });

module.exports = mongoose.model("UserOTPverification", userOTPSchema);
