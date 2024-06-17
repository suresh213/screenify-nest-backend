import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserVerification,
  UserVerificationSchema,
} from '../database/schema/userVerification.schema';
import { UserVerificationController } from './userVerification.controller';
import { UserVerificationService } from './userVerification.service';
import { UserModule } from '../user/user.module';
import { SMSModule } from '../sms/sms.module';
import { SMSService } from '../sms/sms.service';

@Module({
  imports: [
    UserModule,
    SMSModule,
    MongooseModule.forFeature([
      { name: UserVerification.name, schema: UserVerificationSchema },
    ]),
  ],
  controllers: [UserVerificationController],
  providers: [UserVerificationService, SMSService],
  exports: [UserVerificationService],
})
export class UserVerificationModule {}
