import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserVerification } from '../database/schema/userVerification.schema';
import { UserVerificationDto } from './dto/user-verification.dto';

@Injectable()
export class UserVerificationService {
  constructor(
    @InjectModel(UserVerification.name)
    private readonly userVerificationModel: Model<UserVerification>,
  ) {}

  async find(condition: any): Promise<UserVerification> {
    return await this.userVerificationModel.findOne(condition).exec();
  }

  async create(createUserVerificationDto: any): Promise<UserVerification> {
    const userVerification = await this.userVerificationModel
      .findOne({
        ...createUserVerificationDto,
      })
      .exec();

    if (userVerification) return userVerification;

    return await this.userVerificationModel.create({
      ...createUserVerificationDto,
    });
  }

  async update(
    condition: any,
    updateUserVerificationDto: UserVerificationDto | any,
  ): Promise<any> {
    return await this.userVerificationModel
      .updateOne(condition, updateUserVerificationDto)
      .exec();
  }

  async delete(condition: any): Promise<any> {
    return await this.userVerificationModel.deleteOne(condition).exec();
  }
}
