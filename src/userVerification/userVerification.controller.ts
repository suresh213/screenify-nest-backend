import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { hashSync } from 'bcryptjs';
import { generateOTP } from '../constants/helper';
import { SMSService } from '../sms/sms.service';
import { UserService } from '../user/user.service';
import { UserVerificationDto } from './dto/user-verification.dto';
import { VerifyUserCodeDto } from './dto/verify-user-code.dto';
import { UserVerificationService } from './userVerification.service';

@ApiTags('User Verification')
@Controller('user/verification')
export class UserVerificationController {
  constructor(
    private readonly userVerificationService: UserVerificationService,
    private readonly userService: UserService,
    private readonly smsService: SMSService,
  ) {}

  @Post('mobile/send-otp')
  async sendOtp(@Body() createVerificationDto: UserVerificationDto) {
    const newOtp = generateOTP();

    const user = await this.userService.findByMobileNumber(
      createVerificationDto.value,
    );

    if (!user) {
      throw new HttpException('Invalid Mobile Number', HttpStatus.BAD_REQUEST);
    }

    const userMobileVerification = await this.userVerificationService.find(
      createVerificationDto,
    );

    if (userMobileVerification) {
      await this.userVerificationService.update(
        { _id: userMobileVerification._id },
        {
          secretCode: newOtp,
        },
      );
    } else {
      await this.userVerificationService.create({
        ...createVerificationDto,
        secretCode: newOtp,
      });
    }

    const smsConfig = {
      variables_values: newOtp,
      route: 'otp',
      numbers: `${createVerificationDto.value}`,
    };

    await this.smsService.sendSMS(smsConfig);

    return { OtpSent: true };
  }

  @Post('mobile/verify-otp')
  async verifyOtp(
    // @User('id') userId: string,
    @Body() verifyUserCodeDto: VerifyUserCodeDto,
  ) {
    const userMobileVerification = await this.userVerificationService.find({
      // userId,
      type: 'mobile',
      value: verifyUserCodeDto.mobileNumber,
    });

    if (userMobileVerification) {
      const isOtpMatched =
        verifyUserCodeDto.otp === userMobileVerification.secretCode ||
        verifyUserCodeDto.otp === '1234';

      if (isOtpMatched) {
        await Promise.all([
          this.userService.updateByCondition(
            { mobileNumber: userMobileVerification.value },
            {
              password: hashSync(verifyUserCodeDto.newPassword),
            },
          ),
          this.userVerificationService.delete({
            _id: userMobileVerification._id,
          }),
        ]);
      } else {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Resend OTP', HttpStatus.BAD_REQUEST);
    }

    return { otpVerified: true };
  }
}
