import { GoogleGenerativeAI } from '@google/generative-ai';
import { Conversation, ConversationEmbedding } from '@/types';

export class EmbeddingService {
  private genAI: GoogleGenerativeAI;
  private readonly BATCH_SIZE = 1; // Process one at a time to avoid payload limits
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between batches

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateEmbeddings(
    conversations: Conversation[],
    onProgress?: (progress: number, message: string) => void
  ): Promise<ConversationEmbedding[]> {
    const embeddings: ConversationEmbedding[] = [];
    const batches = this.createBatches(conversations, this.BATCH_SIZE);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const progress = (i / batches.length) * 100;
      
      onProgress?.(progress, `Processing batch ${i + 1} of ${batches.length}...`);
      
      try {
        const batchEmbeddings = await this.processBatch(batch);
        embeddings.push(...batchEmbeddings);
        
        // Rate limiting
        if (i < batches.length - 1) {
          await this.delay(this.RATE_LIMIT_DELAY);
        }
      } catch (error) {
        console.error(`Failed to process batch ${i + 1}:`, error);
        // Continue with next batch instead of failing completely
        continue;
      }
    }

    onProgress?.(100, 'Embedding generation complete');
    return embeddings;
  }

  private async processBatch(conversations: Conversation[]): Promise<ConversationEmbedding[]> {
    const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const embeddings: ConversationEmbedding[] = [];

    for (const conversation of conversations) {
      try {
        const text = this.prepareTextForEmbedding(conversation);
        
        // Retry logic for API calls
        const result = await this.retryWithBackoff(async () => {
          return await model.embedContent(text);
        }, 3);
        
        if (result.embedding && result.embedding.values) {
          embeddings.push({
            conversationId: conversation.id,
            embedding: result.embedding.values,
            metadata: {
              wordCount: conversation.metadata.wordCount,
              topicKeywords: conversation.metadata.topics,
              generatedAt: new Date()
            }
          });
        }
      } catch (error) {
        console.error(`Failed to generate embedding for conversation ${conversation.id}:`, error);
        // Log the specific error for debugging
        if (error instanceof Error) {
          console.error(`Error details: ${error.message}`);
        }
        continue;
      }
    }

    return embeddings;
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await this.delay(delay);
      }
    }
    
    throw lastError!;
  }

  private prepareTextForEmbedding(conversation: Conversation): string {
    // Combine title, summary, and key messages for embedding
    const title = conversation.title.substring(0, 100); // Limit title length
    const summary = conversation.summary.substring(0, 200); // Limit summary length
    
    // Take first few user messages and assistant responses, but limit their length
    const keyMessages = conversation.messages
      .slice(0, 4) // Reduced to 4 messages
      .map(msg => {
        const content = msg.content.substring(0, 300); // Limit each message to 300 chars
        return `${msg.role}: ${content}`;
      })
      .join('\n');

    const fullText = `Title: ${title}\nSummary: ${summary}\nKey Messages:\n${keyMessages}`;
    
    // Ensure the total text doesn't exceed ~8000 characters (well under the byte limit)
    return fullText.substring(0, 8000);
  }

  calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  calculateSimilarityMatrix(embeddings: ConversationEmbedding[]): Map<string, Map<string, number>> {
    const matrix = new Map<string, Map<string, number>>();

    for (let i = 0; i < embeddings.length; i++) {
      const embedding1 = embeddings[i];
      const similarities = new Map<string, number>();

      for (let j = 0; j < embeddings.length; j++) {
        if (i === j) {
          similarities.set(embeddings[j].conversationId, 1.0);
          continue;
        }

        const embedding2 = embeddings[j];
        const similarity = this.calculateCosineSimilarity(
          embedding1.embedding,
          embedding2.embedding
        );
        similarities.set(embedding2.conversationId, similarity);
      }

      matrix.set(embedding1.conversationId, similarities);
    }

    return matrix;
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}