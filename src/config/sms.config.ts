import { registerAs } from '@nestjs/config';

export default registerAs('sms', () => ({
  api: process.env.SMS_API,
  url: process.env.SMS_URL,
}));
