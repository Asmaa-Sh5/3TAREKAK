const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asmaaalshohma@gmail.com",
      pass: "nwlb kcty qzih hcin", 
    },
  });

  // Email options
  const mailOptions = {
    from: "asmaaalshohma@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  };

  // Send email
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
const sendpassresetOTP = async (email, otp) => {
  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asmaaalshohma@gmail.com",
      pass: "nwlb kcty qzih hcin", 
    },
  });

  // Email options
  const mailOptions = {
    from: "asmaaalshohma@gmail.com",
    to: email,
    subject: "password reset OTP",
    text: `Your OTP is: ${otp}`,
  };

  // Send email
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendOTP,sendpassresetOTP };
