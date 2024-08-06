import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CandidateAssessment } from '../database/schema/candidateAssessment.schema';
import { CreateCandidateAssessmentDto } from './dto/create-candidate-assessment.dto';

const excludeCandidateProps = '';

@Injectable()
export class CandidateAssessmentService {
  constructor(
    @InjectModel(CandidateAssessment.name)
    private readonly candidateAssessmentModel: Model<CandidateAssessment>,
  ) {}

  async findAll(condition: any): Promise<any> {
    return await this.candidateAssessmentModel
      .find(condition)
      .select(excludeCandidateProps)
      .populate('invitedBy')
      .populate('candidate')
      .populate('assessment')
      .exec();
  }

  async findById(id: string): Promise<any> {
    const assessment = await this.candidateAssessmentModel
      .findById(id)
      .populate('invitedBy')
      .populate('candidate')
      .populate('assessment')
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
    return await this.candidateAssessmentModel
      .findOne(condition)
      .select(excludeCandidateProps)
      .populate('invitedBy')
      .populate('candidate')
      .populate('assessment')
      .exec();
  }

  async create(
    createCandidateDto: CreateCandidateAssessmentDto | any,
  ): Promise<any> {
    return await this.candidateAssessmentModel.create(createCandidateDto);
  }

  async update(id: string, updateCandidateDto: any): Promise<any> {
    await this.candidateAssessmentModel
      .findByIdAndUpdate(id, updateCandidateDto)
      .exec();

    return await this.findById(id);
  }

  async updateByCondition(
    condition: any,
    updateCandidateDto: any,
  ): Promise<any> {
    await this.candidateAssessmentModel
      .updateOne(condition, updateCandidateDto)
      .exec();

    return await this.findByCondition(condition);
  }

  async delete(id: string): Promise<void> {
    const assessment = await this.candidateAssessmentModel.findByIdAndDelete(
      id,
    );

    if (!assessment) {
      throw new HttpException(
        `Candidate assessment with ${id} id does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
