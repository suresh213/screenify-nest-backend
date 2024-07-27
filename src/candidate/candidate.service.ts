import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CandidateAssessment } from '../database/schema/candidateAssessment.schema';
import { CreateCandidateDto } from './dto/create-candidate.dto';

const excludeCandidateProps = '';

@Injectable()
export class CandidateService {
  constructor(
    @InjectModel(CandidateAssessment.name)
    private readonly candidateModel: Model<CandidateAssessment>,
  ) {}

  async findAll(condition: any): Promise<any> {
    return await this.candidateModel
      .find(condition)
      .select(excludeCandidateProps)
      .populate('invitedBy')
      .exec();
  }

  async findById(id: string): Promise<any> {
    const assessment = await this.candidateModel
      .findById(id)
      .populate('invitedBy')
      .select(excludeCandidateProps)
      .exec();

    if (assessment) {
      return assessment;
    }

    throw new HttpException(
      `Candidate with ${id} id does not exist.`,
      HttpStatus.NOT_FOUND,
    );
  }

  async findByCondition(condition: any): Promise<any> {
    return await this.candidateModel
      .findOne(condition)
      .select(excludeCandidateProps)
      .exec();
  }

  async create(createCandidateDto: CreateCandidateDto | any): Promise<any> {
    return await this.candidateModel.create(createCandidateDto);
  }

  async update(id: string, updateCandidateDto: any): Promise<any> {
    await this.candidateModel.findByIdAndUpdate(id, updateCandidateDto).exec();

    return await this.findById(id);
  }

  async updateByCondition(
    condition: any,
    updateCandidateDto: any,
  ): Promise<any> {
    await this.candidateModel.updateOne(condition, updateCandidateDto).exec();

    return await this.findByCondition(condition);
  }

  async delete(id: string): Promise<void> {
    const assessment = await this.candidateModel.findByIdAndDelete(id);

    if (!assessment) {
      throw new HttpException(
        `Candidate with ${id} id does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
