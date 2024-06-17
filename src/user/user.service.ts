import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../database/schema/user.schema';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

const excludeUserProps = '-password';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(condition: any): Promise<any> {
    const users = await this.userModel
      .find(condition)
      .select(excludeUserProps)
      .exec();

    return users;
  }

  async findById(id: any): Promise<any> {
    console.log(id);
    const user = await this.userModel
      .findById(new mongoose.Types.ObjectId('6670587796236870a5c778d2'))
      .select(excludeUserProps)
      .exec();

    // if (user) {
    return { _id: new mongoose.Types.ObjectId('6670587796236870a5c778d2') };
    // }

    throw new HttpException(
      `User with ${id} id does not exist.`,
      HttpStatus.NOT_FOUND,
    );
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  async findOne(condition: any): Promise<any> {
    const user = await this.userModel
      .findOne(condition)
      .select(excludeUserProps)
      .exec();

    return user ? user.toJSON() : null;
  }

  async create(
    createUserDto: CreateUserDto | CreateGoogleUserDto | any,
  ): Promise<any> {
    return await this.userModel.create(createUserDto);
  }

  async update(id: string, updateUserDto: any): Promise<any> {
    await this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
    return await this.findById(id);
  }

  async updateByCondition(condition: any, updateUserDto: any): Promise<any> {
    await this.userModel.updateOne(condition, updateUserDto).exec();
    return await this.findOne(condition);
  }

  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    return await this.userModel.findOne({ mobileNumber }).exec();
  }
}
