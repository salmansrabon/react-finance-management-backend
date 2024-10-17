const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');

const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'gsc.json');
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Set up OAuth2 client
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: SCOPES,
  clientOptions: {
    subject: 'salman@roadtocareer.net',  // The email of the user you want to impersonate
  },
});

// Function to send email
async function sendEmail(from, to, subject, text) {
  try {
    const client = await auth.getClient();
    const gmail = google.gmail({ version: 'v1', auth: client });

    // Set up the email parameters
    const email = {
      from,
      to,
      subject,
      text,
    };

    // Encode the message
    const encodedMessage = Buffer.from(
      `From: ${email.from}\r\n` +
      `To: ${email.to}\r\n` +
      `Subject: ${email.subject}\r\n\r\n` +
      `${email.text}`
    ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send the email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendEmail };
