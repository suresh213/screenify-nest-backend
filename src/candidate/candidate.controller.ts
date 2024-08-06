import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Candidate } from '../database/schema/candidate.schema';
import { User as UserSchema } from '../database/schema/user.schema';
import { User } from '../decorators/user.decorator';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@ApiTags('Candidates')
@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(
    @User() user: UserSchema | any,
    @Query('assessment') assessment?: string,
    @Query('email') email?: string,
  ): Promise<Candidate[]> {
    return await this.candidateService.findAll({
      createdBy: new Types.ObjectId(user._id),
      ...(assessment && { assessment: new Types.ObjectId(assessment) }),
      ...(email && { email }),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Candidate> {
    return await this.candidateService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @User() user: UserSchema | any,
    @Body() createCandidateDto: CreateCandidateDto,
  ): Promise<Candidate> {
    return await this.candidateService.create({
      ...createCandidateDto,
      createdBy: new Types.ObjectId(user._id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.candidateService.delete(id);
  }
}
