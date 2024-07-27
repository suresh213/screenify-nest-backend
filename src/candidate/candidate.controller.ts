import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AssessmentService } from '../assessment/assessment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { User as UserSchema } from '../database/schema/user.schema';
import { User } from '../decorators/user.decorator';
import { MailService } from '../mail/mail.service';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidateAssessment } from '../database/schema/candidateAssessment.schema';

@ApiTags('Candidates')
@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly assessmentService: AssessmentService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(
    @User() user: UserSchema | any,
    @Query('assessment') assessment?: string,
    @Query('isCompleted') isCompleted?: boolean,
    @Query('email') email?: string,
  ): Promise<CandidateAssessment[]> {
    return await this.candidateService.findAll({
      invitedBy: new Types.ObjectId(user._id),
      ...(assessment && { assessment: new Types.ObjectId(assessment) }),
      ...(isCompleted && { isCompleted }),
      ...(email && { email }),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CandidateAssessment> {
    return await this.candidateService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @Body() createCandidateDto: CreateCandidateDto,
  ): Promise<CandidateAssessment> {
    return await this.candidateService.create(createCandidateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('invite')
  async invite(
    @User() user: UserSchema | any,
    @Body() createCandidateDto: CreateCandidateDto,
  ): Promise<CandidateAssessment> {
    const candidate = await this.candidateService.findByCondition({
      email: createCandidateDto.email,
      assessment: new Types.ObjectId(createCandidateDto.assessment),
    });

    if (candidate) {
      throw new HttpException(
        'Candidate already invited',
        HttpStatus.BAD_REQUEST,
      );
    }

    const invitedCandidate = await this.candidateService.create({
      ...createCandidateDto,
      assessment: new Types.ObjectId(createCandidateDto.assessment),
      invitedBy: new Types.ObjectId(user._id),
    });

    this.mailService.assessmentInvite(
      createCandidateDto.email,
      createCandidateDto.assessment,
    );

    return invitedCandidate;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('validate')
  async validate(@Query() validateQuery: any) {
    const { email, assessmentId } = validateQuery;

    const candidate = await this.candidateService.findByCondition({
      email,
      assessmentId,
    });

    if (candidate.isCompleted) {
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
  //   return await this.candidateService.update(id, updateCandidateDto);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.candidateService.delete(id);
  }
}
