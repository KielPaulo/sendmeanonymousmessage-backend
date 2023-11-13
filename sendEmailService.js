require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

//this is for prod
// const corsOptions = {
//     origin: 'http://your-frontend-domain.com',
//   };

//   app.use(cors(corsOptions));

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
    res.status(200).send('Email sent');
  } catch (error) {
    console.error('Error sending email: ', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
