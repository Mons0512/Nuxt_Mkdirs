import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateObject } from 'ai';
import { z } from 'zod';

/**
 * Get AI model based on configured provider
 */
export function getAIModel() {
  const config = useRuntimeConfig();
  const provider = config.aiProvider || 'google';

  switch (provider) {
    case 'google':
      if (!config.googleAiApiKey) {
        throw new Error('Google AI API key is not configured');
      }
      // Create Google AI instance with API key
      const google = createGoogleGenerativeAI({
        apiKey: config.googleAiApiKey,
      });
      // Use gemini-2.0-flash-exp (latest available model)
      return google('gemini-2.0-flash-exp');

    case 'openai':
      if (!config.openaiApiKey) {
        throw new Error('OpenAI API key is not configured');
      }
      // Create OpenAI instance with API key
      const openai = createOpenAI({
        apiKey: config.openaiApiKey,
      });
      return openai('gpt-4o-mini');

    case 'deepseek':
      if (!config.deepseekApiKey) {
        throw new Error('DeepSeek API key is not configured');
      }
      // Create DeepSeek instance with official SDK
      const deepseek = createDeepSeek({
        apiKey: config.deepseekApiKey,
      });
      // Use deepseek-chat model
      return deepseek('deepseek-chat');

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Extract website metadata using AI
 */
export async function extractWebsiteMetadata(html: string, url: string) {
  const model = getAIModel();

  const schema = z.object({
    name: z.string().describe('The name or title of the website/product'),
    description: z.string().describe('A brief description of what the website/product does (1-2 sentences)'),
    introduction: z.string().describe('A detailed introduction about the website/product (2-3 paragraphs in markdown format)'),
    category: z.string().describe('The primary category this website belongs to (e.g., "Productivity", "Design Tools", "AI Tools")'),
    tags: z.array(z.string()).describe('Relevant tags for this website (3-5 tags)'),
  });

  try {
    const result = await generateObject({
      model,
      schema,
      prompt: `Analyze the following HTML content from ${url} and extract structured metadata.
      
HTML Content:
${html.substring(0, 8000)}

Please provide:
1. A clear, concise name/title
2. A brief description (1-2 sentences)
3. A detailed introduction in markdown format (2-3 paragraphs)
4. The primary category
5. 3-5 relevant tags

Focus on the main purpose and value proposition of the website.`,
    });

    return result.object;
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error('Failed to extract metadata with AI');
  }
}
