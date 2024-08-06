import { PartialType } from '@nestjs/mapped-types';

import { CreateCandidateAssessmentDto } from './create-candidate-assessment.dto';

export class UpdateCandidateAssessmentDto extends PartialType(
  CreateCandidateAssessmentDto,
) {}
