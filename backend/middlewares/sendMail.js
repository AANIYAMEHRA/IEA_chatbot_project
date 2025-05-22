import { createTransport } from "nodemailer";

const sendMail = async (email, subject, otp) => {
  try {
    if (!process.env.GMAIL || !process.env.GMAIL_PASSWORD) {
      throw new Error("Email credentials not configured");
    }

    const transport = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .otp {
            font-size: 32px;
            font-weight: bold;
            color: #4CAF50;
            margin: 20px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
            letter-spacing: 5px;
        }
        .note {
            font-size: 14px;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Your OTP for verification is:</p>
        <div class="otp">${otp}</div>
        <p>This OTP will expire in 5 minutes.</p>
        <p class="note">If you didn't request this OTP, please ignore this email.</p>
    </div>
</body>
</html>`;

    const mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject: subject,
      html: html,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

export default sendMail;
