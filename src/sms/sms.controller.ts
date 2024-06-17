// import {
//   Body,
//   Controller,
//   HttpException,
//   HttpStatus,
//   Post,
// } from '@nestjs/common';

// import { ApiTags } from '@nestjs/swagger';
// import { SMSService } from './sms.service';
// import { generateOTP } from '../constants/helper';
// import { UserService } from '../user/user.service';

// @ApiTags('SMS')
// @Controller('sms')
// export class SMSController {
//   constructor(
//     private readonly smsService: SMSService,
//     private readonly userService: UserService,
//   ) {}

//   @Post('sendOtp')
//   async sendOtp(@Body() sendSMSDto: any) {
//     const { phoneNumber } = sendSMSDto;
//     const otp = generateOTP();
//     await this.smsService.sendSMS({ phoneNumber });
//     return { success: true, message: 'OTP sent successfully' };
//   }

//   @Post('verifyOtp')
//   async verifyOtp(@Body() verifyOtpDto: any) {
//     const { mobileNumber, code, newPassword } = verifyOtpDto;
//     const isVerified = await this.userService.findOne({
//       forgotPasswordReset: {
//         mobileNumber,
//         code,
//       },
//     });
//     if (!isVerified) {
//       throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
//     }
//     return { success: true, message: 'OTP verified successfully' };
//   }
// }
