const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Requires"],
      min: [10, "Name Must not be less than 10 characters"],
      max: [100, "Name Must not exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone is Requires"],
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "must provide Password"],
    },
    photo: {
      type: String,
      // required: [true, "Provide Rider's Image"],
    },
    // confirmPassword: {
    //   type: String,
    //   required: [true, "must provide Password"],
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
      name: this.name
      // isverified: this.isverified
    },
    process.env.JWT_SEC,
    { expiresIn: "3d" }
  );
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch
}

module.exports = mongoose.model("User", userSchema);
