import nodemailer from 'nodemailer';

let emailIndex = 0;
class Mailer {
  smtpOption: any;
  transporter: any;
  constructor(host: string, port: string | number, user: string, pass: string) {
    if (!host || !port || !user || !pass) {
      console.error('Mailer, invlaid parameters');
      throw new Error('Mailer, invlaid parameters');
    }

    this.smtpOption = {
      host,
      port,
      secure: false,
      auth: {
        user,
        pass,
      },
      //   tls: {
      //     ciphers: 'SSLv3',
      //   },
    };
  }

  async sendMail(from: string, to: string, subject: string, content: string = '', code_type: string, html: boolean = true) {
    const email_accounts = process.env.EMAIL_USERNAME.split(',');
    const email_passwords = process.env.EMAIL_PASSWORD.split(',');
    emailIndex = emailIndex >= email_accounts.length ? 0 : emailIndex;

    const mailOptions: any = {
      from,
      to,
      subject,
    };
    if (html) {
      mailOptions.html = content;
    } else {
      mailOptions.text = content;
    }
    let _smtpOption: Record<string, any> = {};
    console.log('emailIndex:::', emailIndex);

    _smtpOption = {
      ...this.smtpOption,
      auth: {
        user: email_accounts[emailIndex],
        pass: email_passwords[emailIndex],
      },
    };

    console.log('_smtpOption::::', _smtpOption);
    mailOptions.from = `si.online ${process.env.EMAIL_USERNAME}`;
    emailIndex++;
    console.log('from::', _smtpOption.auth.user, 'to:', to, 'content:', code_type, mailOptions);
    const transporter = nodemailer.createTransport(_smtpOption);
    return await transporter.sendMail(mailOptions);
  }
}

const mail = new Mailer(process.env.EMAIL_SERVER, process.env.EMAIL_PORT, process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);

export default mail;
