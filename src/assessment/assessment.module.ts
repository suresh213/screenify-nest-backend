import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Assessment,
  AssessmentSchema,
} from '../database/schema/assessment.schema';
import { StorageService } from '../storage/storage.service';
import { UserModule } from '../user/user.module';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { AIModule } from '../ai/ai.module';
import {
  AssessmentQuestion,
  AssessmentQuestionSchema,
} from '../database/schema/assessmentQuestion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: AssessmentQuestion.name, schema: AssessmentQuestionSchema },
    ]),
    UserModule,
    AIModule,
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService, StorageService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
