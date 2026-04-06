import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rishikangra657@gmail.com",
      pass: "geyb smkf lyjb gynk"
    }
  });

  const mailOptions = {
    from: "rishikangra657@gmail.com",
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
