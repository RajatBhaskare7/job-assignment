import OpenAI from 'openai';
import { env } from '@/env.mjs';

// Create a singleton OpenAI client
let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

export async function generateCareerCounselingResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  const openai = getOpenAIClient();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional career counselor with expertise in career development, job searching, resume building, interview preparation, and professional growth.
          
Your goal is to provide personalized, actionable advice to help users navigate their career challenges. Be empathetic, supportive, and practical in your responses.
          
Focus on:
- Providing specific, actionable advice rather than generic statements
- Asking clarifying questions when needed to better understand the user's situation
- Offering resources, strategies, and next steps
- Being encouraging while remaining realistic about career prospects
- Adapting your advice to the user's experience level, industry, and specific needs
          
Avoid:
- Giving overly generic advice without considering the user's specific situation
- Making promises about job outcomes or salary expectations
- Providing advice that could be discriminatory or biased
- Sharing personal opinions on political or controversial topics
          
Your responses should be concise, helpful, and focused on empowering the user in their career journey.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message.content || 'I apologize, but I was unable to generate a response. Please try again.';
  } catch (error) {
    console.error('Error generating career counseling response:', error);
    return 'I apologize, but I encountered an error while generating a response. Please try again later.';
  }
}