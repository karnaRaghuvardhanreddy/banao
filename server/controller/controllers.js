// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
// const nodemailer = require('nodemailer');
// require('dotenv').config(); // Load environment variables

// // Temporary storage for verification codes (in production, use Redis or a database)
// let verificationCodes = {};

// // Generate a random verification code
// const generateCode = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
// };

// // Helper function to verify codes
// const verifyCode = (email, userCode) => {
//   return verificationCodes[email] === userCode;
// };

// // Signup Route
// const signup = async (req, res) => {
//   const { username, email, password, verificationCode } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User already exists", alreadyExisted: true, success: false });
//     }

//     if (!verifyCode(email, verificationCode)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid verification code", success: false });
//     }
//     console.log(password);
//     // Hash the password
//     // const salt = await bcrypt.genSalt(10);
//     // const hashedPassword = await bcrypt.hash(password, salt);

//     const user = new User({ username, email, password: password});
//     await user.save();

//     // Clear the verification code after successful signup
//     delete verificationCodes[email];

//     res.status(201).json({
//       message: "User created successfully",
//       success: true,
//       alreadyExisted: false,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Login Route
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "Invalid credentials", emailexist: false, passwordmatch: false, success: false });
//     }
//     var isMatch;
//     //const isMatch = await bcrypt.compare(password, user.password);
//     if(password===user.password){
//       isMatch=true;
//     }
//     else{
//       isMatch=false;
//     }
//     // const secondhashed=await bcrypt.hash(password, salt);
//     console.log(isMatch);
//     console.log(password,user.password,user.username)
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ message: "Invalid credentials", emailexist: true, passwordmatch: false, success: false });
//     }

//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' } // Adjust expiration as needed
//     );
//     //alert("login successful");
//     res.status(200).json({ message: "Login successful", token, success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Forgot Password Route
// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "No user found with that email" });
//     }

//     const code = generateCode();
//     verificationCodes[email] = code;

//     setTimeout(() => delete verificationCodes[email], 10 * 60 * 1000); // Code expires after 10 minutes

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Password Reset Code',
//       text: `Your password reset code is: ${code}`,
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Failed to send email" });
//       }

//       res.status(200).json({ message: "Verification code sent to your email" });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Reset Password Route
// const resetPassword = async (req, res) => {
//   const { email, verificationCode, newPassword} = req.body;
//   console.log(newPassword,email,verificationCode)

//   try {
//     if (!verifyCode(email, verificationCode)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid verification code", success: false });
//     }

//     // const salt = await bcrypt.genSalt(10);
//     // const hashedPassword = await bcrypt.hash(newPassword, salt);

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "No user found with that email" });
//     }

//     user.password = newPassword;
//     await user.save();

//     delete verificationCodes[email];

//     res.status(200).json({ message: "Password reset successful", success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Send Verification Code Route
// const sendVerificationCode = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const code = generateCode();
//     verificationCodes[email] = code;

//     setTimeout(() => delete verificationCodes[email], 10 * 60 * 1000); // Code expires after 10 minutes

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Signup Verification Code',
//       text: `Your verification code is: ${code}`,
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Failed to send email" ,success:false});
//       }

//       res.status(200).json({ message: "Verification code sent to your email",success:true});
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error",success:false });
//   }
// };

// module.exports = {
//   signup,
//   login,
//   forgotPassword,
//   resetPassword,
//   sendVerificationCode,
// };



const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Temporary storage for verification codes (in production, use Redis or a database)
let verificationCodes = {};

// Generate a random verification code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Helper function to verify codes
const verifyCode = (email, userCode) => {
  return verificationCodes[email] === userCode;
};

// Signup Route
const signup = async (req, res) => {
  const { username, email, password, verificationCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", alreadyExisted: true, success: false });
    }

    if (!verifyCode(email, verificationCode)) {
      return res.status(400).json({ message: "Invalid verification code", success: false });
    }

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Clear the verification code after successful signup
    delete verificationCodes[email];

    res.status(201).json({
      message: "User created successfully",
      success: true,
      alreadyExisted: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Route
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    // Compare hashed password with the provided password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    // Generate JWT token for authentication
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Adjust expiration as needed
    );

    res.status(200).json({ message: "Login successful", token, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password Route
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with that email" });
    }

    const code = generateCode();
    verificationCodes[email] = code;

    setTimeout(() => delete verificationCodes[email], 10 * 60 * 1000); // Code expires after 10 minutes

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to send email" });
      }

      res.status(200).json({ message: "Verification code sent to your email" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password Route
const resetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    if (!verifyCode(email, verificationCode)) {
      return res.status(400).json({ message: "Invalid verification code", success: false });
    }

    // Hash the new password before updating in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with that email" });
    }

    user.password = hashedPassword;
    await user.save();

    delete verificationCodes[email];

    res.status(200).json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send Verification Code Route
const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const code = generateCode();
    verificationCodes[email] = code;

    setTimeout(() => delete verificationCodes[email], 10 * 60 * 1000); // Code expires after 10 minutes

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Signup Verification Code',
      text: `Your verification code is: ${code}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to send email", success: false });
      }

      res.status(200).json({ message: "Verification code sent to your email", success: true });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  sendVerificationCode,
};
