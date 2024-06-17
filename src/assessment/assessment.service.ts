import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assessment } from '../database/schema/assessment.schema';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AssessmentQuestion } from '../database/schema/assessmentQuestion.schema';

const excludeAssessmentProps = '';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectModel(Assessment.name)
    private readonly assessmentModel: Model<Assessment>,
    @InjectModel(AssessmentQuestion.name)
    private readonly assessmentQuestionModel: Model<AssessmentQuestion>,
  ) {}

  async findAll(condition: any): Promise<any> {
    return await this.assessmentModel
      .find(condition)
      .select(excludeAssessmentProps)
      .populate('user')
      .exec();
  }

  async findById(id: string): Promise<any> {
    const assessment = await this.assessmentModel
      .findById(id)
      .populate('user')
      .select(excludeAssessmentProps)
      .exec();

    if (assessment) {
      return assessment;
    }

    throw new HttpException(
      `Assessment with ${id} id does not exist.`,
      HttpStatus.NOT_FOUND,
    );
  }

  async findByCondition(condition: any): Promise<any> {
    return await this.assessmentModel
      .findOne(condition)
      .populate('user')
      .select(excludeAssessmentProps)
      .exec();
  }

  async create(createAssessmentDto: CreateAssessmentDto | any): Promise<any> {
    console.log(createAssessmentDto);
    return await this.assessmentModel.create(createAssessmentDto);
  }

  async update(id: string, updateAssessmentDto: any): Promise<any> {
    await this.assessmentModel
      .findByIdAndUpdate(id, updateAssessmentDto)
      .exec();

    return await this.findById(id);
  }

  async updateByCondition(
    condition: any,
    updateAssessmentDto: any,
  ): Promise<any> {
    await this.assessmentModel.updateOne(condition, updateAssessmentDto).exec();

    return await this.findByCondition(condition);
  }

  async delete(id: string): Promise<void> {
    const assessment = await this.assessmentModel.findByIdAndDelete(id);

    if (!assessment) {
      throw new HttpException(
        `Assessment with ${id} id does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllAssessmentQuestions(
    condition: any,
  ): Promise<AssessmentQuestion[]> {
    return await this.assessmentQuestionModel.find(condition).exec();
  }

  async findAssessmentQuestionByCondition(
    condition: any,
  ): Promise<AssessmentQuestion> {
    return await this.assessmentQuestionModel.findOne(condition).exec();
  }

  async createAssessmentQuestion(
    createAssessmentQuestionDto: AssessmentQuestion,
  ): Promise<AssessmentQuestion> {
    return await this.assessmentQuestionModel.create(
      createAssessmentQuestionDto,
    );
  }

  async updateAssessmentQuestion(
    id: string,
    updateAssessmentQuestionDto: AssessmentQuestion,
  ): Promise<AssessmentQuestion> {
    return await this.assessmentQuestionModel
      .findByIdAndUpdate(id, updateAssessmentQuestionDto, { new: true })
      .exec();
  }

  async deleteAssessmentQuestion(id: string): Promise<void> {
    const assessmentQuestion =
      await this.assessmentQuestionModel.findByIdAndDelete(id);

    if (!assessmentQuestion) {
      throw new HttpException(
        `AssessmentQuestion with ${id} id does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async bulkCreateAssessmentQuestions(
    assessmentQuestions: AssessmentQuestion[],
  ): Promise<AssessmentQuestion[]> {
    return await this.assessmentQuestionModel.insertMany(assessmentQuestions);
  }

  async bulkDeleteAssessmentQuestion(assessmentId: string): Promise<any> {
    return await this.assessmentQuestionModel
      .deleteMany({ assessmentId: assessmentId })
      .exec();
  }
}
