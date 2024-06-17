import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async findAll(@User() user: UserSchema | any) {
    return await this.candidateService.findAll({
      user: new Types.ObjectId(user._id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.candidateService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createCandidateDto: CreateCandidateDto) {
    return await this.candidateService.create(createCandidateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('invite')
  async invite(@Body() createCandidateDto: CreateCandidateDto) {
    const invitedCandidate = await this.candidateService.create(
      createCandidateDto,
    );

    await this.mailService.assessmentInvite(
      createCandidateDto.email,
      createCandidateDto.assessment,
    );
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return await this.candidateService.update(id, updateCandidateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.candidateService.delete(id);
  }
}
