import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { User } from '../database/schema/user.schema';
import { SendMailDto } from './dto/send-mail.dto';
import { AssessmentInviteTemplate } from './templates/assessment-invite';
import { forgotPasswordTemplate } from './templates/forgot-password';
import { magicLinkTemplate } from './templates/magic-link';

const emailCredentials = {
  host: 'smtp.gmail.com',
  port: 587, // SMTP port (587 for TLS, 465 for SSL)
  secure: false, // Set to true if using a secure connection (e.g., TLS)
  auth: {
    user: 'screenify.ai@gmail.com', // Your email address
    pass: 'vqmk apsc tpkj ranf',
  },
};

@Injectable()
export class MailService {
  transporter: any;

  // Create a transporter object using the defined credentials

  constructor(private configService: ConfigService) {
    // this.transporter = new Resend(configService.get('mail.api'));
    this.transporter = nodemailer.createTransport(emailCredentials);
  }

  async sendEmail(sendMailDto: SendMailDto) {
    try {
      await this.transporter.sendMail({
        from: `${sendMailDto.from.name} <${sendMailDto.from.email}>`,
        to: `${sendMailDto.to.name} <${sendMailDto.to.email}>`,
        subject: sendMailDto.subject,
        text: sendMailDto.message,
        html: sendMailDto.message,
      });
    } catch (err) {
      console.log(err);
      console.log('Error in Sending mail', err.statusCode);
    }
  }

  async sendForgotPasswordEmail(user: User, resetToken: string): Promise<void> {
    const appUrl = this.configService.get<string>('app.url');
    const url = `${appUrl}?resetToken=${resetToken}`;

    const sendMailDto: SendMailDto = {
      from: {
        name: this.configService.get<string>('mail.from.name'),
        email: this.configService.get<string>('mail.from.email'),
      },
      to: {
        name: user.name,
        email: user.email,
      },
      subject: `Reset your ${this.configService.get<string>(
        'app.name',
      )} password`,
      message: forgotPasswordTemplate(user, url),
    };

    await this.sendEmail(sendMailDto);
  }

  async sendMagicLink(email: string, token: string): Promise<void> {
    const appUrl = this.configService.get<string>('app.url');
    const url = `${appUrl}/auth/magic/verify?token=${token}`;

    const sendMailDto: SendMailDto = {
      from: {
        name: this.configService.get<string>('mail.from.name'),
        email: this.configService.get<string>('mail.from.email'),
      },
      to: {
        email: email,
        name: `${this.configService.get<string>('app.name')} user`,
      },
      subject: `Login to ${this.configService.get<string>('app.name')}`,
      message: magicLinkTemplate(url),
    };

    await this.sendEmail(sendMailDto);
  }

  async assessmentInvite(email, assessmentId): Promise<void> {
    const appUrl = this.configService.get<string>('app.url');
    const url = `${appUrl}/assessment/${email}/${assessmentId}`;

    const sendMailDto: SendMailDto = {
      from: {
        name: this.configService.get<string>('mail.from.name'),
        email: this.configService.get<string>('mail.from.email'),
      },
      to: {
        email: email,
        name: `${this.configService.get<string>('app.name')} user`,
      },
      subject: `Assessment Invite`,
      message: AssessmentInviteTemplate(url),
    };

    await this.sendEmail(sendMailDto);
  }
}
