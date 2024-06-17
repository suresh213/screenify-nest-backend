import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  timezone: process.env.TZ,
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  url: process.env.APP_URL,
  name: process.env.APP_NAME,
}));
