require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

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

//dompurifyier anti XSS
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

app.post(
  '/sendEmail',
  [
    // Validate the length of the 'emailContent' field
    body('emailContent').isLength({ max: 500 }).withMessage('Message should not exceed 500 characters.')
  ],
  async (req, res) => {
    const { emailContent } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    // Sanitize user input to prevent XSS
    const sanitizedEmailContent = DOMPurify.sanitize(emailContent);

    let mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: 'An anonymous message!',

      html: `
    <div style="background: linear-gradient(to right,#2e9bfb,#8ecff6,#d7f1ff); padding: 60px; text-align: center;">
      <div style="background: linear-gradient(61deg,#005bab,#81ddd9); border-radius: 20px; padding: 110px 20px 20px 20px; text-align: center; width: 350px; margin: 0 auto;">
      <div style="background-color: #fff; border-radius: 50px; padding: 6px;"><h3 style="color: #777;">${sanitizedEmailContent}</h3></div>
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
  }
);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
