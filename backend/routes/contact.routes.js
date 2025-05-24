const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, address, reason } = req.body;

  // Configure your email transport with Gmail App Password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ujjawaltripathi1406@gmail.com", // your Gmail
      pass: "hello@123", // ❗ use your 16-character Gmail App Password here
    },
  });

  const mailOptions = {
    from: "ujjawaltripathi1407@gmail.com", // use your verified Gmail here
    to: "ujjawaltripathi1406@gmail.com",
    subject: "New Contact Form Submission",
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Address: ${address}
      Reason: ${reason}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email", error: err.toString() });
  }
});

module.exports = router;
