import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../../database/schema/user.schema';
import { UserService } from '../../user/user.service';
import { Jwt } from './jwt.dto';
import { Types } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.jwtSecret'),
      ignoreExpiration: false,
    });
  }

  async validate({ id }: Jwt): Promise<User> {
    return await this.usersService.findById(new Types.ObjectId(id));
  }
}
