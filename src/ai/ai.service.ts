import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const apiKey = process.env.OPEN_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

@Injectable()
export class AIService {
  constructor(private configService: ConfigService) {}

  async getOpenAiResponse(prompt: any) {
    console.log(this.configService.get('ai.apiKey'));
    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.configService.get('ai.apiKey')}`,
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.log(error.response.data);
      throw new HttpException(
        'Failed to get response from ai',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
