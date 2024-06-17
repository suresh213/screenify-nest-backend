import { Module } from '@nestjs/common';
import { AssessmentModule } from './assessment/assessment.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { StorageService } from './storage/storage.service';
import { UserModule } from './user/user.module';
import { AIModule } from './ai/ai.module';
import { CandidateModule } from './candidate/candidate.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    MailModule,
    AuthModule,
    AssessmentModule,
    AIModule,
    CandidateModule
  ],
  controllers: [],
  providers: [StorageService],
})
export class AppModule {}
