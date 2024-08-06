import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AssessmentService } from '../assessment/assessment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { CandidateService } from '../candidate/candidate.service';
import { CandidateAssessment } from '../database/schema/candidateAssessment.schema';
import { User as UserSchema } from '../database/schema/user.schema';
import { User } from '../decorators/user.decorator';
import { MailService } from '../mail/mail.service';
import { CandidateAssessmentService } from './candidateAssessment.service';
import { CreateCandidateAssessmentDto } from './dto/create-candidate-assessment.dto';

@ApiTags('Candidates')
@Controller('candidate/assessment')
export class CandidateAssessmentController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly candidateAssessmentService: CandidateAssessmentService,
    private readonly assessmentService: AssessmentService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('')
  async findAll(
    @User() user: UserSchema | any,
    @Query('assessment') assessment?: string,
    @Query('isCompleted') isCompleted?: boolean,
    @Query('candidate') candidate?: string,
  ): Promise<CandidateAssessment[]> {
    return await this.candidateAssessmentService.findAll({
      invitedBy: new Types.ObjectId(user._id),
      ...(assessment && { assessment: new Types.ObjectId(assessment) }),
      ...(candidate && { candidate: new Types.ObjectId(candidate) }),
      ...(isCompleted && { isCompleted }),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CandidateAssessment> {
    return await this.candidateAssessmentService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @Body() createCandidateDto: CreateCandidateAssessmentDto,
  ): Promise<CandidateAssessment> {
    return await this.candidateAssessmentService.create(createCandidateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('invite')
  async invite(
    @User() user: UserSchema | any,
    @Body() createCandidateDto: CreateCandidateAssessmentDto,
  ): Promise<CandidateAssessment> {
    const candidate = await this.candidateService.findByCondition({
      _id: new Types.ObjectId(createCandidateDto.candidate),
    });

    if (!candidate) {
      throw new HttpException('Invalid candidate', HttpStatus.BAD_REQUEST);
    }

    const candidateAssessment =
      await this.candidateAssessmentService.findByCondition({
        candidate: new Types.ObjectId(createCandidateDto.candidate),
        assessment: new Types.ObjectId(createCandidateDto.assessment),
      });

    if (candidateAssessment) {
      throw new HttpException(
        'Candidate already invited',
        HttpStatus.BAD_REQUEST,
      );
    }

    const invitedCandidate = await this.candidateAssessmentService.create({
      ...createCandidateDto,
      assessment: new Types.ObjectId(createCandidateDto.assessment),
      candidate: new Types.ObjectId(createCandidateDto.candidate),
      invitedBy: new Types.ObjectId(user._id),
    });

    this.mailService.assessmentInvite(
      candidate.email,
      createCandidateDto.assessment,
    );

    return invitedCandidate;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('validate')
  async validate(@Query() validateQuery: any) {
    const { candidateId, assessmentId } = validateQuery;

    const candidate = await this.candidateService.findByCondition({
      _id: new Types.ObjectId(candidateId),
    });

    if (!candidate) {
      throw new HttpException('Invalid candidate', HttpStatus.BAD_REQUEST);
    }

    const candidateAssessment =
      await this.candidateAssessmentService.findByCondition({
        candidate: new Types.ObjectId(candidateId),
        assessment: new Types.ObjectId(assessmentId),
      });

    if (candidateAssessment.isCompleted) {
      throw new Error('Assessment already completed');
    }

    const [assessment, assessmentQuestions] = await Promise.all([
      this.assessmentService.findById(assessmentId),
      this.assessmentService.findAllAssessmentQuestions({ assessmentId }),
    ]);

    return { assessment, assessmentQuestions };
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateCandidateDto: CandidateAssessment,
  // ): Promise<CandidateAssessment> {
  //   return await this.candidateAssessmentService.update(id, updateCandidateDto);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.candidateAssessmentService.delete(id);
  }
}
