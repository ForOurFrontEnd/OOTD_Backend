import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, code: number): Promise<void> {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'OOTD 회윈가입 이메일 인증 코드',
      text: `인증 코드: ${code}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
