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

    html: `
    <div style="background: linear-gradient(to right,#2e9bfb,#8ecff6,#d7f1ff); padding: 60px; text-align: center;">
      <div style="background: linear-gradient(61deg,#005bab,#81ddd9); border-radius: 20px; padding: 110px 20px 20px 20px; text-align: center; width: 350px; margin: 0 auto;">
      <div style="background-color: #fff; border-radius: 50px; padding: 3px;"><h3 style="color: #777;">${emailContent}</h3></div>
      </div>
    </div>
  `
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
