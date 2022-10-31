const express = require("express");
const User = require("../models/User");
const UserOTPverification = require("../models/UserOTPVerification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Register User
const registerUser = async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  const phoneExist = await User.findOne({ phone: req.body.phone });
  if (emailExist || phoneExist) {
    res.status(409).json({
      status: "conflict",
      message: "Email Address or Phone number Already exist",
    });
  } else {
    try {
      const user = await User.create({ ...req.body });

      // Generate OTP
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      // MAIL OTP TO USER
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Password by Xpress Riders Management System",
        html: `<p> Enter <b> ${otp} </b> in the App</p>`,
      };

      // Hash OTP
      const hashedOTP = await bcrypt.hash(otp, 10);
      const OTPVerification = new UserOTPverification({
        userId: user.id,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      });

      await OTPVerification.save();
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return res
            .status(201)
            .json({ success: true, message: "OTP Verification sent to Email" });
        }
      });
      const { password, ...otherInfo } = user._doc;
      res.status(201).json({ success: true, ...otherInfo });
      // sendOTPVerificationEmail(req, res);

      // let transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAIL,
      //     pass: process.env.PASSWORD,
      //   },
      // });
      // const mailOptions = {
      //   from: process.env.EMAIL,
      //   to: user.email,
      //   subject: "Password by Xpress Riders Management System",
      //   html:
      //     "<p><b>Your Login Details for Xpress Riders Management System</b><br><b>Email:</b>" +
      //     user.email +
      //     "<br><b>Password: </b> " +
      //     req.body.password +
      //     ' <br><a href="http://localhost:4200/">Click here to login</a> </p>',
      // };

      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     return res.status(201).json({
      //       success: true,
      //       message: "Check your Email for your Login Details",
      //     });
      //   }
      // });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
  const userId = req.params.id;

  try {
    const { otp } = req.body;
    // const { userId, otp } = req.body;
    if (!userId || !otp) {
      res.status(404).json({ success: false, message: "Empty OTP Deatails" });
    } else {
      const userOTP = await UserOTPverification.find({ userId });
      if (!userOTP) {
        res.status(404).json({ success: false, message: "Invalid User" });
      } else {
        const { expiresAt } = userOTP[0];
        const hashedOTP = userOTP[0].otp;
        if (expiresAt < Date.now()) {
          await UserOTPverification.deleteMany({ userId });
          res.status(404).json({ success: false, message: "Code has Expired" });
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            res.status(404).json({
              success: false,
              message: "Invalid Code check your Inbox for the correct Code",
            });
          } else {
            await User.findByIdAndUpdate({ _id: userId }, { isverified: true });
            await UserOTPverification.deleteMany({ userId });
            res.status(200).json({
              success: true,
              message: "User Email Verified Successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GENERATING OTP
// const sendOTPVerificationEmail = async (req, res) => {
//   req.body.userId = req.user.id;
//   const { email } = req.param;

//   try {
//     const user = await User.findOne(email);
//     const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

//     // MAIL OTP
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//       },
//     });
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: user.email,
//       subject: "Your One Time Password",
//       html: `<p> Enter <b> ${otp} </b> in the App</p>`,
//     };

//     const hashedOTP = await bcrypt.hash(otp, 10);
//     const OTPVerification = new UserOTPverification({
//       userId: req.body.userId,
//       otp: hashedOTP,
//       createdAt: Date.now(),
//       expiresAt: Date.now() + 3600000,
//     });

//     const generatedOTP = await OTPVerification.save();

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         return res
//           .status(201)
//           .json(
//             { success: true, message: "OTP Verification sent to Email" },
//             generatedOTP
//           );
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "Incorrect Email Address" });
    } else {
      // console.log(user._id);
      req.body.userId = user._id;
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

      // MAIL OTP
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Your One Time Password",
        html: `<p> Enter <b> ${otp} </b> in the App</p>`,
      };

      const hashedOTP = await bcrypt.hash(otp, 10);
      const OTPVerification = new UserOTPverification({
        userId: req.body.userId,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      });

      const generatedOTP = await OTPVerification.save();

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return res
            .status(200)
            .json(
              { success: true, message: "OTP Verification sent to Email" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CHANGE PASSWORD
const changePass = async (req, res) => {
  const userId = req.params.id;
  const updatePassword = ({
    password : await bcrypt.hash(req.body.password, 10),
  })
  try {
    const changepssword = await User.findByIdAndUpdate(userId, updatePassword, {
      new: true,
      runValidators: true,
    });
    if (!changepssword) {
      res.status(500).json({
        success: false,
        message: "Password Not Updated Please try Again",
      });
    } else {
      res.status(200).json({ success: true, changepssword });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Wrong Email Address" });
    } else {
      // Check the Password
      const isPasswordCorrect = await user.comparePassword(password);
      if (isPasswordCorrect) {
        // Create Token
        const accessToken = user.createJWT();
        req.session.isAuth = true;
        const { password, ...otherInfo } = user._doc;
        res
          .status(200)
          .json({ success: true, data: { ...otherInfo, accessToken } });
        // res.redirect('/userDashboard');
      } else {
        res
          .status(400)
          .json({ success: false, message: "Wrong User Password" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// lOG OUT AND DESTROY SESSION
const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw err;
    } else {
      res.send("Session Destroyed");
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  logOut,
  verifyOTP,
  changePass,
  forgotPassword,
  // sendOTPVerificationEmail,
};
