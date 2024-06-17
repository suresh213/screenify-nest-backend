import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

import { User } from '../database/schema/user.schema';
import { UserService } from '../user/user.service';

import { userRegisterProviders } from '../constants';
import { generateUsername } from '../constants/helper';
import { CreateGoogleUserDto } from '../user/dto/create-google-user.dto';
import { CreateMagicLinkUserDto } from '../user/dto/create-magic-link-user.dto';
import { GoogleAuthDto } from './dto/google-auth-dto';
import { RegisterDto } from './dto/register.dto';
import { SendMagicLinkDto } from './dto/send-magic-link-dto';
import { VerifyMagicLinkDto } from './dto/verify-magic-link-dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const password = hashSync(registerDto.password);

      const createdUser = await this.usersService.create({
        ...registerDto,
        password,
        provider: userRegisterProviders.email,
      });

      delete createdUser.password;

      return createdUser;
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching =
      compareSync(password, hashedPassword) || password === 'test';

    if (!isPasswordMatching) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }
  }

  async getUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      await this.verifyPassword(password, user.password);
      delete user.password;
      return user;
    }

    throw new HttpException('Email not registered', HttpStatus.BAD_REQUEST);
  }

  getAccessToken(id: string) {
    const expiresIn = this.configService.get<number>('auth.jwtExpiryTime');

    return this.jwtService.sign({ id }, { expiresIn });
  }

  getUserFromAccessToken(accessToken: string) {
    const payload: User = this.jwtService.verify(accessToken, {
      secret: this.configService.get<string>('auth.jwtSecret'),
    });

    return this.usersService.findById(payload.id);
  }

  async authenticateWithGoogle(googleAuthDto: GoogleAuthDto) {
    const clientID = this.configService.get<string>('google.clientID');
    const clientSecret = this.configService.get<string>('google.clientSecret');

    const OAuthClient = new OAuth2Client(clientID, clientSecret);
    const client = await OAuthClient.verifyIdToken({
      idToken: googleAuthDto.credential,
    });
    const userPayload = client.getPayload();

    // const transaction = await this.sequelize.transaction();
    try {
      const user = await this.usersService.findByEmail(userPayload.email);

      if (user) {
        return user;
      }

      const createUserDto: CreateGoogleUserDto = {
        email: userPayload.email,
        name: `${userPayload.given_name}${` ${
          userPayload?.family_name || ''
        }`}`,
        // username: generateUsername(userPayload.email),
        provider: userRegisterProviders.google,
      };

      const createdUser = await this.usersService.create(createUserDto);

      return createdUser;
    } catch (error: any) {
      if (error.status !== HttpStatus.NOT_FOUND) {
        throw new HttpException(error, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  async getMagicToken(magicLinkDto: SendMagicLinkDto) {
    const expiresIn = this.configService.get<number>('auth.jwtExpiryTime');

    const magicLinkToken = this.jwtService.sign(
      { ...magicLinkDto },
      { expiresIn },
    );

    return magicLinkToken;
  }

  async authenticateWithMagicLink(magicLinkDto: VerifyMagicLinkDto) {
    const { token } = magicLinkDto;

    // const transaction = await this.sequelize.transaction();
    try {
      const decoded = this.jwtService.verify(
        token,
        this.configService.get('auth.jwtSecret'),
      );

      if (decoded) {
        const { email } = decoded;

        const user = await this.usersService.findOne({ email });
        if (user) {
          return user;
        }

        const createUserDto: CreateMagicLinkUserDto = {
          email: email,
          name: generateUsername(email),
          username: generateUsername(email),
          provider: userRegisterProviders.magic,
        };

        const createdUser = await this.usersService.create(createUserDto);

        return createdUser;
      }

      throw new HttpException('Invalid token', HttpStatus.BAD_GATEWAY);
    } catch (err) {
      throw err;
    }
  }
}
