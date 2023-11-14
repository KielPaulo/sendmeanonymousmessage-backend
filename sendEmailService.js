require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');

app.use(express.json());

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

app.post('/sendEmail', async (req, res) => {
  const { emailContent } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'An anonymous message!',
    text: emailContent
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).send('Anonymous message sent');
  } catch (error) {
    console.error('Error sending message: ', error);
    res.status(500).send('Error sending message');
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
