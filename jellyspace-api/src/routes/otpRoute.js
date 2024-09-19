const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const OTP = require("../models/otp");
const User = require("../models/user"); // Assuming you need User model for some functionality

// Configure nodemailer transport (update with your email service provider details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lavanya.g@edutechex.com', // your email address
        pass: 'Gundapaneni@202902'    // your email password
    }
});

// Email sending function
async function emailSending(to, subject, html) {
    try {
        const mailOptions = {
            from: 'lavanya.g@edutechex.com',
            to: to,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Function to generate OTP
function generateOTP() {
    try {
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return Number(OTP);
    } catch (error) {
        throw new Error('Error generating OTP');
    }
}

// Route to send OTP
router.post("/sendOTP", async (req, res) => {
    try {
        const generateOtp = generateOTP();

        const divideOTP = generateOtp.toString().split('');
        divideOTP[5] = divideOTP[5] !== undefined ? divideOTP[5] : "1";

        const getOTPData = {
            status: 200,
            mail: req.body.email,
            OTP: Number(divideOTP.join('')),
            success: true
        };

        const htmlBodyForOTP = '<!DOCTYPE html><html lang="en" style="font-family: Agency FB;"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template 6</title></head>' +
            '<body style="font-family:Agency FB"><header><img style="padding: 20px;margin-left: 20%;width: 70px;" src="https://jellyspace-public.s3.amazonaws.com/jellyspacelogo.jpeg" alt="logo"><h6 style="margin: -32px;margin-left: 20%;">Space Technology Made Accessible</h6></header>' +
            '<section class="container-fluid" style="margin: 20px;"><div class="container"><p>Hi ' + req.body.name + ' </p></div>' +
            '<div class="article" style="margin-top:45px ;"><p>Welcome to <span style="color:#92d051 ;">JELLYSPACE!</span> <br>You are going to be part of a global platform that is exclusively made for:</p></div><div class="list">' +
            '<ul><li style="list-style-type: disc;">Space</li><li style="list-style-type: disc;">New Space | Satellites</li><li style="list-style-type: disc;">Aerospace | Aviation | UAV | Drones</li><li style="list-style-type: disc;">Components, Manufacturing & Test</li></ul>' +
            '</div><div class="article" style="margin-top:45px ;"><p>There‘s a lot  to explore and engage in the platform with its cutting-edge amazing features and the community.</p><p>Please prove you‘re a real person by entering this Verification Code</p></div>' +
            '<div class="otp"><div class="row" style="display: inline-flex;margin: 20px;">' +
            '<div class="col-2"> <input type="text" style="padding: 6px;width: 30px; margin: 15px; background-color: #99c139;border-radius: 7px; text-align: center;" name="number" value="' + divideOTP[0] + '" placeholder="1"></div>' +
            '<div class="col-2"><input type="text" style="padding: 6px;width: 30px; margin: 15px; background-color: #99c139; border-radius: 7px; text-align: center;" name="number" value="' + divideOTP[1] + '" placeholder="1"></div>' +
            '<div class="col-2"><input type="text" style="padding: 6px;width: 30px; margin: 15px; background-color: #99c139; border-radius: 7px; text-align: center;" name="number" value="' + divideOTP[2] + '" placeholder="1"></div>' +
            '<div class="col-2"><input type="text" style="padding: 6px;width: 30px; margin: 15px; background-color: #99c139; border-radius: 7px; text-align: center;" name="number" value="' + divideOTP[3] + '" placeholder="1"></div>' +
            '<div class="col-2"><input type="text" style="padding: 6px;width: 30px; margin: 15px; background-color: #99c139; border-radius: 7px; text-align: center;" name="number" value="' + divideOTP[4] + '" placeholder="1"> </div>' +
            '<div class="col-2"><input type="text" style="padding: 6px;width: 30px; margin: 15px; background-color: #99c139;border-radius: 7px; text-align: center;" name="number" value="' + divideOTP[5] + '" placeholder="1"></div>'  +
            '</div></div><div><p> The Verification Code will be valid for <strong> 60 sec </strong>. Please do not share this code with anyone.</p></div>' +
            '<div><p>Thanks,</p><p>The <span style="color:#92d051 ;">JELLYSPACE</span> Team</p></div><div style="margin-top: 50px;"><p>Please do not reply directly to this emai Copyright © 2023 JELLYSPACE. All rights reserved. <br>Contact Us | Legal Notices and Terms of Use | Privacy Statement</p></div></section></body></html>';

        await emailSending(req.body.email, 'Verification Code(Expires in 60 Sec)', htmlBodyForOTP);

        const otpExist = await OTP.find({ where: { mail: req.body.email } });

        if (otpExist) {
            await OTP.update(getOTPData, {
                where: { mail: req.body.email }
            });
        } else {
            await OTP.create(getOTPData);
        }

        return res.json({
            status: true,
            message: 'Verification Code sent to your registered email',
            data: getOTPData
        });
    } catch (err) {
        console.log('error ' + JSON.stringify(err));
        return res.json({
            status: false,
            message: 'Verification Code sending failed',
            data: ''
        });
    }
});

// Route to verify OTP
router.post("/verifyOTP", async (req, res) => {
    try {
        const otpExist = await OTP.find({ where: { mail: req.body.email } });

        if (otpExist && otpExist.OTP === req.body.OTP) {
            return res.json({
                status: true,
                message: 'Verification Code successfully verified',
                data: ''
            });
        } else {
            return res.json({
                status: false,
                message: 'Verification Code verification failed',
                data: ''
            });
        }
    } catch (err) {
        console.log('error ' + JSON.stringify(err));
        return res.json({
            status: false,
            message: 'Verification Code verification failed',
            data: ''
        });
    }
});

module.exports = router;
