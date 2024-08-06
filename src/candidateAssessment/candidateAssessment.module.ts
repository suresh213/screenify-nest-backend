import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentModule } from '../assessment/assessment.module';
import { CandidateModule } from '../candidate/candidate.module';
import {
  CandidateAssessment,
  CandidateAssessmentSchema,
} from '../database/schema/candidateAssessment.schema';
import { MailService } from '../mail/mail.service';
import { StorageService } from '../storage/storage.service';
import { UserModule } from '../user/user.module';
import { CandidateAssessmentController } from './candidateAssessment.controller';
import { CandidateAssessmentService } from './candidateAssessment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CandidateAssessment.name, schema: CandidateAssessmentSchema },
    ]),
    UserModule,
    AssessmentModule,
    CandidateModule,
  ],
  controllers: [CandidateAssessmentController],
  providers: [CandidateAssessmentService, StorageService, MailService],
  exports: [CandidateAssessmentService],
})
export class CandidateAssessmentModule {}
