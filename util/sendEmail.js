require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const sendEmail = emailOption => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: emailOption.to,
    subject: emailOption.subject,
    html: emailOption.html
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;

// sendEmail({
//   to: "emmanuelibekwe7@gmail.com",
//   subject: "Signup succeeded",
//   html: "<h1>You successfully signed up!</h1>"
// });
