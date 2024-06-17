import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SendSMSDto } from './dto/send-sms.dto';

@Injectable()
export class SMSService {
  apiKey: string;
  url: string;

  constructor(private configService: ConfigService) {
    this.apiKey = configService.get('sms.api');
    this.url = configService.get('sms.url');
  }

  async sendSMS(sendSmsDto: SendSMSDto) {
    try {
      await axios.post(this.url, sendSmsDto, {
        headers: {
          authorization: this.apiKey,
        },
      });
    } catch (err) {
      console.log('Error in Sending SMS', err);
      // throw new HttpException('Error in Sending SMS', err.statusCode);
    }
  }
}
