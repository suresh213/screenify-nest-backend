class TestCaseDto {
  input: string;
  output: string;
}

class OptionDto {
  a: string;
  b: string;
  c: string;
  d: string;
}

class CodingLanguagesDto {
  'c++': string;
  java: string;
  javascript: string;
}

export class AssessmentQuestionDto {
  title: string;
  description?: string;
  answer?: string;
  example?: Array<TestCaseDto>;
  testCases?: Array<TestCaseDto>;
  options?: OptionDto;
  difficulty?: string;
  solution?: string;
  functionSignature?: CodingLanguagesDto;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}
