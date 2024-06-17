import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';

import appConfig from './app.config';
import authConfig from './auth.config';
import databaseConfig from './database.config';
import fileConfig from './storage.config';
import googleConfig from './google.config';
import mailConfig from './mail.config';
import smsConfig from './sms.config';
import paymentConfig from './payment.config';
import verificationConfig from './verification.config';
import aiConfig from './ai.config';

const validationSchema = Joi?.object({
  // App
  TZ: Joi.string().default('UTC'),
  APP_URL: Joi.string().default('http://localhost:3000'),
  APP_Name: Joi.string().default('Screenify'),
  PORT: Joi.number().default(8080),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  // Storage
  // STORAGE_URI: Joi.string().required(),

  // Database
  MONGO_URI: Joi.string().required(),

  // Auth
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY_TIME: Joi.number().required(),

  // Google
  // GOOGLE_API_KEY: Joi.string().allow(''),
  // GOOGLE_CLIENT_SECRET: Joi.string().allow(''),
  // GOOGLE_CLIENT_ID: Joi.string().allow(''),

  // Mail
  MAIL_API: Joi.string().required(),
  MAIL_FROM_NAME: Joi.string().allow(''),
  MAIL_FROM_EMAIL: Joi.string().allow(''),
  MAIL_HOST: Joi.string().allow(''),
  MAIL_PORT: Joi.string().allow(''),
  MAIL_USERNAME: Joi.string().allow(''),
  MAIL_PASSWORD: Joi.string().allow(''),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        googleConfig,
        fileConfig,
        mailConfig,
        smsConfig,
        paymentConfig,
        verificationConfig,
        aiConfig
      ],
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
