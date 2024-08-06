import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Candidate,
  CandidateSchema,
} from '../database/schema/candidate.schema';
import { MailService } from '../mail/mail.service';
import { StorageService } from '../storage/storage.service';
import { UserModule } from '../user/user.module';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
    UserModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}
