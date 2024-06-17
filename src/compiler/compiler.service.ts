import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const JUDGE0_URL_RAPIDAPI = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_URL_SHARPENER = 'https://api.judge0.sharpener.tech';
const JUDGE0_API_KEY = '67825263cdmsh6b82f8ec911dc53p1e942cjsn0230920db10a';
const JUDGE0_HOST = 'judge0-ce.p.rapidapi.com';

const getCompilerUrl = (isRapidAPI = false) => JUDGE0_URL_RAPIDAPI;

@Injectable()
export class CompilerService {
  constructor() {}

  async testUserCode(data: any) {
    const { code, CodingLanguageId, testCases, isRapidAPI } = data;

    const outputTestCases = testCases.map((t) => ({
      language_id: CodingLanguageId,
      source_code: code,
      stdin: t.input,
    }));

    let submissionTokens = [];

    console.log(outputTestCases);
    if (outputTestCases.length > 0) {
      const options = {
        method: 'POST',
        url: `${getCompilerUrl(isRapidAPI)}/submissions/batch`,
        data: {
          submissions: outputTestCases,
        },
        headers: {
          'X-RapidAPI-Key': `${JUDGE0_API_KEY}`,
          'X-RapidAPI-Host': `${JUDGE0_HOST}`,
        },
      };
      console.log(options);
      const response = await axios.request(options);
      console.log(response);
      submissionTokens = response.data;
    }

    return { submissionTokens };
  }

  async getSubmissionStatus(data: any) {
    const { testCases, codeTokens, isRapidAPI } = data;

    let tokenString = '';
    codeTokens.forEach((t) => {
      tokenString += `${t},`;
    });

    tokenString = tokenString.substring(0, tokenString.length - 1);
    const options = {
      method: 'GET',
      url: `${getCompilerUrl(isRapidAPI)}/submissions/batch`,
      params: {
        tokens: tokenString,
        base64_encoded: true,
      },
      headers: {
        'X-RapidAPI-Key': `${JUDGE0_API_KEY}`,
        'X-RapidAPI-Host': `${JUDGE0_HOST}`,
      },
    };

    let [response]: any = await Promise.all([axios.request(options)]);
    response = response.data;

    // let submissionDone = false;
    response?.submissions.forEach((s: any, i: number) => {
      let userOutput = '';
      let passed = false;
      let loading = false;
      let { output: expectedOutput } = testCases[i];
      const { isHidden, input } = testCases[i];
      s = s || {};

      s.compile_output = Buffer.from(
        (s && s.compile_output) || '',
        'base64',
      ).toString('utf8');
      s.stderr = Buffer.from(s.stderr || '', 'base64').toString('utf8');
      s.stdout = Buffer.from(s.stdout || '', 'base64').toString('utf8');
      // submissionDone = true;
      // checking for all the status is completed or not

      if (
        s.status.description === 'In Queue' ||
        s.status.description === 'Processing'
      ) {
        userOutput = `Submission Status: ${s.status.description}`;
        loading = true;
        // submissionDone = false;
      } else if (s.status.description === 'Time Limit Exceeded') {
        userOutput = `Error :${s.status.description}`;
      } else if (s.stdout) {
        userOutput = s.stdout;
        console.log(userOutput, expectedOutput);
        passed = userOutput == expectedOutput;
      } else if (s.stderr) {
        userOutput = `Error: ${s.stderr}`;
      } else {
        userOutput = `Error: ${s.compile_output}`;
      }

      if (expectedOutput && expectedOutput.length > HttpStatus.BAD_REQUEST) {
        expectedOutput = expectedOutput.substring(0, HttpStatus.BAD_REQUEST);
        expectedOutput += '\nTruncated Output';
      }
      if (userOutput && userOutput.length > HttpStatus.BAD_REQUEST) {
        userOutput = userOutput.substring(0, HttpStatus.BAD_REQUEST);
        userOutput += '\nTruncated Output';
      }
      testCases[i] = {
        ...testCases[i],
        userOutput: isHidden ? '' : userOutput,
        passed,
        loading,
        output: isHidden ? '' : expectedOutput,
        input: isHidden ? '' : input,
      };
    });

    const submissionDone = !testCases.find((t) => t.loading);

    return { submissionDone, testCases };
  }
}
