import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  apiKey: process.env.OPEN_API_KEY,
}));
