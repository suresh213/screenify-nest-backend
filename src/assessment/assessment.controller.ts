import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AIService } from '../ai/ai.service';
import {
  createCodingQuestionPrompt,
  createMcqQuestionsPrompt,
} from '../ai/prompts/assessmentPrompt';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { AssessmentQuestion } from '../database/schema/assessmentQuestion.schema';
import { User as UserSchema } from '../database/schema/user.schema';
import { User } from '../decorators/user.decorator';
import { AssessmentService } from './assessment.service';
import { AssessmentDto } from './dto/assessment.dto';
import { CreateAssessmentDto } from './dto/create-assessment.dto';

@ApiTags('Assessments')
@Controller('assessment')
export class AssessmentController {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly aiService: AIService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@User() user: UserSchema | any): Promise<AssessmentDto[]> {
    return await this.assessmentService.findAll({
      createdBy: new Types.ObjectId(user._id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('questions/:assessmentId')
  async findAllQuestions(
    @Param('assessmentId') assessmentId: string,
  ): Promise<AssessmentQuestion[] | any> {
    return await this.assessmentService.findAllAssessmentQuestions({
      assessment: new Types.ObjectId(assessmentId),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AssessmentDto> {
    return await this.assessmentService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @User('_id') userId,
    @Body() createAssessmentDto: CreateAssessmentDto,
  ) {
    const assessment = await this.assessmentService.create({
      ...createAssessmentDto,
      createdBy: userId,
    });

    console.log(assessment);

    let assessmentQuestions = [];
    if (createAssessmentDto.type === 'CODING') {
      const assessmentPrompt = createCodingQuestionPrompt(assessment);
      const generatedTest = await this.aiService.getOpenAiResponse(
        assessmentPrompt,
      );

      const parsedContent = JSON.parse(generatedTest);
      const requestedQuestions = parsedContent?.questions?.slice(
        0,
        createAssessmentDto.totalQuestions,
      );
      const codingQuestions = requestedQuestions?.map((question: any) => ({
        ...question,
        type: 'CODING',
        assessment: assessment._id,
      }));

      assessmentQuestions = codingQuestions;
    } else if (createAssessmentDto.type === 'MCQ') {
      const assessmentPrompt = createMcqQuestionsPrompt(assessment);
      const generatedTest = await this.aiService.getOpenAiResponse(
        assessmentPrompt,
      );
      const parsedContent = JSON.parse(generatedTest);
      const requestedQuestions = parsedContent?.questions?.slice(
        0,
        createAssessmentDto.totalQuestions,
      );
      const mcqQuestions = requestedQuestions?.map((question: any) => ({
        ...question,
        type: 'MCQ',
        assessment: assessment._id,
      }));

      assessmentQuestions = mcqQuestions;
    }

    console.log(assessmentQuestions);

    const questions =
      await this.assessmentService.bulkCreateAssessmentQuestions(
        assessmentQuestions,
      );
    console.log(questions);

    return {
      assessment: assessment._doc,
      questions,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssessmentDto: CreateAssessmentDto,
  ) {
    const updatedAssessment = await this.assessmentService.update(
      id,
      updateAssessmentDto,
    );

    return updatedAssessment;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.assessmentService.delete(id);
  }
}
