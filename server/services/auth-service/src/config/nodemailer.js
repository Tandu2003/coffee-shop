const { v4 } = require("uuid");
const nodemailer = require("nodemailer");
const { bcryptHash } = require("../config/bcryptjs");
const Verification = require("../models/verification.model");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

const sendVerificationEmail = async (account, res) => {
  const { _id, username, email } = account;
  const currentUrl = `http://localhost:${process.env.PORT}`;
  const uniqueString = v4() + _id;

  const mailOptions = {
    from: `OK BUT FIRST COFFEE <${process.env.AUTH_EMAIL}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
        <h3>Dear ${username}</h3>
        <p>Verify your email address to complete the signup and login into your account.</p>
        <p>This link <b>expires in 15 minute</b>.</p>
        <h4>Press <a href=${
          currentUrl + "/api/auth/user/verify/" + _id + "/" + uniqueString
        }>here</a> to proceed.</h4>`,
  };

  const hashUniqueString = await bcryptHash(uniqueString, res);

  const newVerification = new Verification({
    userId: _id,
    uniqueString: hashUniqueString,
    expiresAt: Date.now() + 900000,
  });

  transporter.sendMail(mailOptions);

  newVerification.save();
};

module.exports = sendVerificationEmail;
