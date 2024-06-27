const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors')
require('dotenv').config(); 

const app = express();
const port = 3000;

app.use(cors({
    origin: ["http://localhost:3001"],
    credentials: true
})) 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    const { name, email, phone, city, country, subject, inquiry, message } = req.body;

    if (!name || !email || !phone || !city || !country || !subject || !inquiry || !message) {
        return res.status(400).send('All fields are required');
    }


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

   
    let mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'New Inquiry Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}\nCountry: ${country}\nSubject: ${subject}\nInquiry: ${inquiry.join(', ')}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            return res.send('Form submitted successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
