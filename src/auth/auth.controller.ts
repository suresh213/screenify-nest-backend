import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { User as UserSchema } from '../database/schema/user.schema';
import { User } from '../decorators/user.decorator';
import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth-dto';
import { RegisterDto } from './dto/register.dto';
import { SendMagicLinkDto } from './dto/send-magic-link-dto';
import { VerifyMagicLinkDto } from './dto/verify-magic-link-dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly usersService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@User() user: UserSchema) {
    return user;
  }

  @Post('google')
  async loginWithGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    try {
      const user = await this.authService.authenticateWithGoogle(googleAuthDto);
      const accessToken = this.authService.getAccessToken(user.id);
      return { user, accessToken };
    } catch (error) {
      throw new HttpException(
        'Google authentication failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('magic/send')
  async sendMagicLink(@Body() sendMagicLinkDto: SendMagicLinkDto) {
    try {
      const magicToken = await this.authService.getMagicToken(sendMagicLinkDto);
      await this.mailService.sendMagicLink(sendMagicLinkDto.email, magicToken);
      return { mailSent: true };
    } catch (error) {
      throw new HttpException(
        'Sending magic link failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('magic/verify')
  async loginWithMagicLink(@Body() verifyMagicLinkDto: VerifyMagicLinkDto) {
    try {
      const user = await this.authService.authenticateWithMagicLink(
        verifyMagicLinkDto,
      );
      const accessToken = this.authService.getAccessToken(user.id);
      return { user, accessToken };
    } catch (error) {
      throw new HttpException(
        'Magic link authentication failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const existingUserByEmail = await this.usersService.findByEmail(
        registerDto.email,
      );
      if (existingUserByEmail) {
        throw new HttpException(
          'Email already linked with another account',
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingUserByMobileNumber =
        await this.usersService.findByMobileNumber(registerDto.mobileNumber);
      if (existingUserByMobileNumber) {
        throw new HttpException(
          'Mobile number already linked with another account',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.authService.register(registerDto);
      const accessToken = this.authService.getAccessToken(user.id);
      return { user, accessToken };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserSchema) {
    const accessToken = this.authService.getAccessToken(user.id);
    return { user, accessToken };
  }

  @Patch('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@User() user: UserSchema) {
    try {
      const updatedUser = await this.usersService.updateByCondition(
        { _id: user._id },
        { isPresent: false },
      );
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return { success: true };
    } catch (error) {
      throw new HttpException(
        'Logout failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
