// chat-history-visualizer/src/services/processingService.ts
import { ChatParser } from './chatParser';
import { EmbeddingService } from './embeddingService';
import { GraphBuilder } from './graphBuilder';
import { 
  ConversationGraph, 
  ProcessingProgress, 
  VisualizationControls,
  Conversation,
  ConversationEmbedding
} from '@/types'

export class ProcessingService {
  private chatParser: ChatParser;
  private embeddingService: EmbeddingService | null = null;
  private graphBuilder: GraphBuilder;

  constructor() {
    this.chatParser = new ChatParser();
    this.graphBuilder = new GraphBuilder();
  }

  async processFile(
    file: File,
    onProgress: (progress: ProcessingProgress) => void,
    isDemoMode: boolean = false
  ): Promise<{ graph: ConversationGraph; rawData: { conversations: Conversation[]; embeddings: ConversationEmbedding[]; similarityMatrix: Map<string, Map<string, number>>; } }> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

    if (!isDemoMode && (!apiKey || !this.validateApiKey(apiKey))) {
      throw new Error('Google AI API key is not configured correctly in .env.local. Please set NEXT_PUBLIC_GOOGLE_AI_API_KEY.');
    }
    console.log('ProcessingService.processFile called with:', { 
      fileName: file.name, 
      isDemoMode, 
      apiKey: apiKey ? 'provided' : 'not provided' 
    });
    
    try {
      // Initialize embedding service with API key only if not in demo mode
      if (!isDemoMode && apiKey) {
        console.log('Initializing real embedding service');
        this.embeddingService = new EmbeddingService(apiKey);
      } else {
        console.log('Demo mode - skipping embedding service initialization');
      }

      // Stage 1: Parse and clean conversations
      onProgress({
        stage: 'parsing',
        progress: 0,
        message: 'Parsing ChatGPT export file...'
      });

      const rawConversations = await this.chatParser.parseExportFile(file);
      
      onProgress({
        stage: 'cleaning',
        progress: 20,
        message: 'Cleaning and filtering conversations...'
      });

      const conversations = this.chatParser.cleanConversations(rawConversations);
      
      if (conversations.length === 0) {
        throw new Error('No valid conversations found in the export file.');
      }

      onProgress({
        stage: 'cleaning',
        progress: 30,
        message: `Found ${conversations.length} valid conversations`
      });

      // Stage 2: Generate embeddings
      onProgress({
        stage: 'embedding',
        progress: 30,
        message: isDemoMode ? 'Generating demo embeddings...' : 'Generating AI embeddings...'
      });

      let embeddings: ConversationEmbedding[];
      
      if (isDemoMode) {
        // Generate mock embeddings for demo mode
        console.log('Generating mock embeddings for demo mode');
        embeddings = this.generateMockEmbeddings(conversations);
        console.log('Mock embeddings generated:', embeddings.length);
        onProgress({
          stage: 'embedding',
          progress: 70,
          message: 'Demo embeddings generated'
        });
      } else {
        console.log('Generating real embeddings with API');
        if (!this.embeddingService) {
          throw new Error('Embedding service not initialized');
        }
        embeddings = await this.embeddingService.generateEmbeddings(
          conversations,
          (embeddingProgress, embeddingMessage) => {
            onProgress({
              stage: 'embedding',
              progress: 30 + (embeddingProgress * 0.4), // 30-70%
              message: embeddingMessage
            });
          }
        );
      }

      if (embeddings.length === 0) {
        throw new Error('Failed to generate embeddings for conversations.');
      }

      // Stage 3: Calculate similarities
      onProgress({
        stage: 'similarity',
        progress: 70,
        message: 'Calculating conversation similarities...'
      });

      const similarityMatrix = isDemoMode 
        ? this.calculateMockSimilarityMatrix(embeddings)
        : this.embeddingService!.calculateSimilarityMatrix(embeddings);

      onProgress({
        stage: 'similarity',
        progress: 85,
        message: 'Building similarity matrix...'
      });

      // Stage 4: Build graph
      onProgress({
        stage: 'graph',
        progress: 85,
        message: 'Building 3D graph structure...'
      });

      // Reverted similarityThreshold to 0.7 as requested.
      const defaultControls: VisualizationControls = {
        similarityThreshold: 0.7, //
        clusteringAlgorithm: 'similarity',
        nodeSize: 'messageCount',
        colorScheme: 'cluster',
        showEdges: true,
        edgeThickness: 1
      };

      const graph = this.graphBuilder.buildGraph(
        conversations,
        embeddings,
        similarityMatrix,
        defaultControls
      );

      onProgress({
        stage: 'complete',
        progress: 100,
        message: `Successfully processed ${conversations.length} conversations with ${graph.clusters.length} clusters`
      });

      return {
        graph,
        rawData: { conversations, embeddings, similarityMatrix }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onProgress({
        stage: 'parsing',
        progress: 0,
        message: 'Processing failed',
        error: errorMessage
      });
      throw error;
    }
  }

  async rebuildGraph(
    conversations: Conversation[],
    embeddings: ConversationEmbedding[],
    similarityMatrix: Map<string, Map<string, number>>,
    controls: VisualizationControls
  ): Promise<ConversationGraph> {
    return this.graphBuilder.buildGraph(conversations, embeddings, similarityMatrix, controls);
  }

  private validateApiKey(apiKey: string): boolean {
    return Boolean(apiKey && apiKey.trim().length > 30 && apiKey.startsWith('AIza'));
  }

  private generateMockEmbeddings(conversations: Conversation[]): ConversationEmbedding[] {
    return conversations.map((conversation, index) => {
      // Generate deterministic but varied mock embeddings based on conversation content
      const embedding = Array.from({ length: 768 }, (_, i) => {
        // Create pseudo-random but consistent values based on conversation ID and index
        const seed = conversation.id.charCodeAt(0) + i;
        return Math.sin(seed) * Math.cos(index + i) * 0.5;
      });

      // Add some clustering by making similar topics have similar embeddings
      const topics = conversation.metadata.topics;
      if (topics.includes('javascript') || topics.includes('react') || topics.includes('code')) {
        // Programming-related conversations get similar embeddings
        for (let i = 0; i < 100; i++) {
          embedding[i] += 0.3;
        }
      }
      if (topics.includes('python') || topics.includes('data')) {
        // Data science conversations get similar embeddings
        for (let i = 100; i < 200; i++) {
          embedding[i] += 0.3;
        }
      }

      return {
        conversationId: conversation.id,
        embedding,
        metadata: {
          wordCount: conversation.metadata.wordCount,
          topicKeywords: conversation.metadata.topics,
          generatedAt: new Date()
        }
      };
    });
  }

  private calculateMockSimilarityMatrix(embeddings: ConversationEmbedding[]): Map<string, Map<string, number>> {
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
        
        // Calculate cosine similarity for mock embeddings
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let k = 0; k < embedding1.embedding.length; k++) {
          dotProduct += embedding1.embedding[k] * embedding2.embedding[k];
          norm1 += embedding1.embedding[k] * embedding1.embedding[k];
          norm2 += embedding2.embedding[k] * embedding2.embedding[k];
        }

        const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
        const similarity = magnitude === 0 ? 0 : dotProduct / magnitude;
        
        // Ensure similarity is between 0 and 1
        const normalizedSimilarity = Math.max(0, Math.min(1, (similarity + 1) / 2));
        similarities.set(embedding2.conversationId, normalizedSimilarity);
      }

      matrix.set(embedding1.conversationId, similarities);
    }

    return matrix;
  }

  getProcessingStats(graph: ConversationGraph): {
    totalConversations: number;
    totalClusters: number;
    totalConnections: number;
    averageClusterSize: number;
    largestCluster: number;
  } {
    const totalConversations = graph.nodes.length;
    const totalClusters = graph.clusters.length;
    const totalConnections = graph.edges.length;
    const averageClusterSize = totalClusters > 0 
      ? Math.round(graph.clusters.reduce((sum, cluster) => sum + cluster.size, 0) / totalClusters)
      : 0;
    const largestCluster = totalClusters > 0
      ? Math.max(...graph.clusters.map(cluster => cluster.size))
      : 0;

    return {
      totalConversations,
      totalClusters,
      totalConnections,
      averageClusterSize,
      largestCluster
    };
  }
}