import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentModule } from '../assessment/assessment.module';
import {
  CandidateAssessment,
  CandidateAssessmentSchema,
} from '../database/schema/candidateAssessment.schema';
import { MailService } from '../mail/mail.service';
import { StorageService } from '../storage/storage.service';
import { UserModule } from '../user/user.module';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CandidateAssessment.name, schema: CandidateAssessmentSchema },
    ]),
    UserModule,
    AssessmentModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService, StorageService, MailService],
  exports: [CandidateService],
})
export class CandidateModule {}
