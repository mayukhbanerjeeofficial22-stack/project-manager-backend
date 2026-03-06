import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

// Create Mailgen instance once
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'My App',
    link: 'https://taskmanagerlink.com',
  },
});

const sendEmail = async (options) => {
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: process.env.MAILTRAP_SMTP_USER,
    to: options.email, // must match controller
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error('Email service failed!', error);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: 'Welcome to the app',
      action: {
        instructions: 'To get started, please click here:',
        button: {
          color: '#22BC66',
          text: 'Confirm your account',
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: 'We got a request to reset the password for your account.',
      action: {
        instructions: 'To reset your password, please click here:',
        button: {
          color: '#22BC66',
          text: 'Reset your password',
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
