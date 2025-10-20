import OpenAI from 'openai';
import type { ResponseInput } from 'openai/resources/responses/responses';

const PRICE_TABLE: Record<
  string,
  {
    input: number;
    output: number;
  }
> = {
  'gpt-4o-mini': { input: 0.15 / 1_000_000, output: 0.6 / 1_000_000 },
  'gpt-4o': { input: 5 / 1_000_000, output: 15 / 1_000_000 },
  'gpt-4.1': { input: 15 / 1_000_000, output: 60 / 1_000_000 },
  'gpt-4.1-mini': { input: 3 / 1_000_000, output: 12 / 1_000_000 },
  'gpt-4o-realtime-preview': { input: 5 / 1_000_000, output: 15 / 1_000_000 },
};

const RESPONSES_MODEL_PREFIXES = ['gpt-4.1', 'gpt-5'];

function shouldUseResponses(model: string) {
  return RESPONSES_MODEL_PREFIXES.some((prefix) => model.startsWith(prefix));
}

export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
}

export function resolveModel(model?: string) {
  return model || process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini';
}

export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number) {
  const pricing = PRICE_TABLE[model];
  if (!pricing) return 0;
  const cost = inputTokens * pricing.input + outputTokens * pricing.output;
  return Math.round(cost * 1_000_000) / 1_000_000;
}

export type OpenAIClient = ReturnType<typeof createOpenAIClient>;

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatCompletionUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  costUsd: number;
  model: string;
};

export type OpenAIUsageContext = {
  userId: string;
  taskId?: string | null;
  runId?: string | null;
  meta?: Record<string, unknown>;
};

export type OpenAIUsageInsert = {
  user_id: string;
  task_id: string | null;
  run_id: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  meta: Record<string, unknown> | null;
};

type SupabaseInsertClient = {
  from: (table: string) => any;
};

export function buildUsageInsert(usage: ChatCompletionUsage, context: OpenAIUsageContext): OpenAIUsageInsert {
  return {
    user_id: context.userId,
    task_id: context.taskId ?? null,
    run_id: context.runId ?? null,
    model: usage.model,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
    cost_usd: Number(usage.costUsd.toFixed(4)),
    meta: context.meta ? (context.meta as Record<string, unknown>) : null,
  };
}

export async function persistOpenAIUsage(
  client: SupabaseInsertClient | null | undefined,
  usage: ChatCompletionUsage,
  context: OpenAIUsageContext
) {
  if (!client || !context.userId) return;
  try {
    const payload = buildUsageInsert(usage, context);
    const { error } = await client.from('openai_usage').insert(payload);
    if (error) {
      console.error('persistOpenAIUsage error', error);
    }
  } catch (error) {
    console.error('persistOpenAIUsage exception', error);
  }
}

export async function runChatCompletionWithUsage({
  client,
  model: preferredModel,
  messages,
  temperature,
  topP,
  maxRetries = 1,
  onUsage,
}: {
  client?: OpenAIClient;
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  topP?: number;
  maxRetries?: number;
  onUsage?: (usage: ChatCompletionUsage) => Promise<void> | void;
}): Promise<{
  output: string;
  usage: ChatCompletionUsage;
}> {
  const openai = client ?? createOpenAIClient();
  const model = resolveModel(preferredModel);

  let attempt = 0;
  let lastError: unknown;
  while (attempt < Math.max(1, maxRetries)) {
    try {
      const startedAt = Date.now();
      let output = '';
      let usage: ChatCompletionUsage;

      if (shouldUseResponses(model)) {
        const responseInput = messages.map((message) => ({
          role: message.role,
          type: 'message' as const,
          content: [{ type: 'text' as const, text: message.content }],
        })) as unknown as ResponseInput;
        const response = await openai.responses.create({
          model,
          input: responseInput,
          temperature,
          top_p: topP,
        });
        const latencyMs = Date.now() - startedAt;
        const inputTokens = response.usage?.input_tokens ?? 0;
        const outputTokens = response.usage?.output_tokens ?? 0;
        const totalTokensRaw = response.usage?.total_tokens;
        const totalTokens =
          typeof totalTokensRaw === 'number' && Number.isFinite(totalTokensRaw)
            ? totalTokensRaw
            : inputTokens + outputTokens;
        output = response.output_text ?? '';
        if (!output && Array.isArray(response.output) && response.output.length > 0) {
          const first = response.output[0] as any;
          const contentItems = Array.isArray(first?.content) ? first.content : [];
          const textPart = contentItems.find(
            (item: any) => item && item.type === 'text' && typeof item.text === 'string'
          );
          if (textPart) {
            output = textPart.text as string;
          }
        }
        usage = {
          inputTokens,
          outputTokens,
          totalTokens,
          latencyMs,
          costUsd: estimateCostUsd(model, inputTokens, outputTokens),
          model,
        };
      } else {
        const completion = await openai.chat.completions.create({
          model,
          messages,
          temperature,
          top_p: topP,
        });
        const latencyMs = Date.now() - startedAt;
        const {
          prompt_tokens: promptTokens = 0,
          completion_tokens: completionTokens = 0,
          total_tokens: totalTokensRaw,
        } = completion.usage ?? {};
        const inputTokens = promptTokens;
        const outputTokens = completionTokens;
        const totalTokens =
          typeof totalTokensRaw === 'number' && Number.isFinite(totalTokensRaw)
            ? totalTokensRaw
            : inputTokens + outputTokens;
        output = completion.choices?.[0]?.message?.content ?? '';
        usage = {
          inputTokens,
          outputTokens,
          totalTokens,
          latencyMs,
          costUsd: estimateCostUsd(model, inputTokens, outputTokens),
          model,
        };
      }

      if (onUsage) {
        await onUsage(usage);
      }

      return {
        output,
        usage,
      };
    } catch (error) {
      lastError = error;
      attempt += 1;
      if (attempt >= Math.max(1, maxRetries)) {
        throw error;
      }
    }
  }
  throw lastError ?? new Error('Chat completion failed');
}
