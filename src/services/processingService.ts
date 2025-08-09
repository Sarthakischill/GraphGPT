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
import { generateMockEmbeddings, calculateMockSimilarityMatrix } from '@/utils/mockData';

/**
 * Service class for processing chat history files.
 * This class orchestrates the parsing, embedding, and graph building process.
 */
export class ProcessingService {
  private chatParser: ChatParser;
  private embeddingService: EmbeddingService | null = null;
  private graphBuilder: GraphBuilder;

  constructor() {
    this.chatParser = new ChatParser();
    this.graphBuilder = new GraphBuilder();
  }

  /**
   * Processes a chat history file and returns a conversation graph.
   * @param file The chat history file to process.
   * @param onProgress A callback function to report progress updates.
   * @param isDemoMode A flag to indicate whether to use mock data.
   * @returns A promise that resolves with the conversation graph and raw data.
   */
  async processFile(
    file: File,
    onProgress: (progress: ProcessingProgress) => void,
    isDemoMode: boolean = false
  ): Promise<{ graph: ConversationGraph; rawData: { conversations: Conversation[]; embeddings: ConversationEmbedding[]; similarityMatrix: Map<string, Map<string, number>>; } }> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

    if (!isDemoMode && (!apiKey || !this.validateApiKey(apiKey))) {
      throw new Error('Google AI API key is not configured correctly in .env.local. Please set NEXT_PUBLIC_GOOGLE_AI_API_KEY.');
    }
    
    let stage: ProcessingProgress['stage'] = 'parsing';
    try {
      // Initialize embedding service with API key only if not in demo mode
      if (!isDemoMode && apiKey) {
        this.embeddingService = new EmbeddingService(apiKey);
      }

      stage = 'parsing';
      const conversations = await this._parseAndCleanConversations(file, onProgress);
      
      stage = 'embedding';
      const embeddings = await this._generateEmbeddings(conversations, isDemoMode, onProgress);

      stage = 'similarity';
      const similarityMatrix = await this._calculateSimilarityMatrix(embeddings, isDemoMode, onProgress);

      stage = 'graph';
      const graph = this._buildGraph(conversations, embeddings, similarityMatrix, onProgress);

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
        stage: stage,
        progress: 0,
        message: `Processing failed at stage: ${stage}`,
        error: errorMessage
      });
      throw error;
    }
  }

  /**
   * Parses and cleans the conversations from a file.
   * @param file The file to parse.
   * @param onProgress A callback function to report progress updates.
   * @returns A promise that resolves with the cleaned conversations.
   */
  private async _parseAndCleanConversations(file: File, onProgress: (progress: ProcessingProgress) => void): Promise<Conversation[]> {
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

    return conversations;
  }

  /**
   * Generates embeddings for the conversations.
   * @param conversations The conversations to generate embeddings for.
   * @param isDemoMode A flag to indicate whether to use mock data.
   * @param onProgress A callback function to report progress updates.
   * @returns A promise that resolves with the conversation embeddings.
   */
  private async _generateEmbeddings(conversations: Conversation[], isDemoMode: boolean, onProgress: (progress: ProcessingProgress) => void): Promise<ConversationEmbedding[]> {
    onProgress({
      stage: 'embedding',
      progress: 30,
      message: isDemoMode ? 'Generating demo embeddings...' : 'Generating AI embeddings...'
    });

    let embeddings: ConversationEmbedding[];

    if (isDemoMode) {
      embeddings = generateMockEmbeddings(conversations);
      onProgress({
        stage: 'embedding',
        progress: 70,
        message: 'Demo embeddings generated'
      });
    } else {
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

    return embeddings;
  }

  /**
   * Calculates the similarity matrix for the conversation embeddings.
   * @param embeddings The conversation embeddings.
   * @param isDemoMode A flag to indicate whether to use mock data.
   * @param onProgress A callback function to report progress updates.
   * @returns A promise that resolves with the similarity matrix.
   */
  private async _calculateSimilarityMatrix(embeddings: ConversationEmbedding[], isDemoMode: boolean, onProgress: (progress: ProcessingProgress) => void): Promise<Map<string, Map<string, number>>> {
    onProgress({
      stage: 'similarity',
      progress: 70,
      message: 'Calculating conversation similarities...'
    });

    const similarityMatrix = isDemoMode
      ? calculateMockSimilarityMatrix(embeddings)
      : this.embeddingService!.calculateSimilarityMatrix(embeddings);

    onProgress({
      stage: 'similarity',
      progress: 85,
      message: 'Building similarity matrix...'
    });

    return similarityMatrix;
  }

  /**
   * Builds the conversation graph.
   * @param conversations The conversations.
   * @param embeddings The conversation embeddings.
   * @param similarityMatrix The similarity matrix.
   * @param onProgress A callback function to report progress updates.
   * @returns The conversation graph.
   */
  private _buildGraph(conversations: Conversation[], embeddings: ConversationEmbedding[], similarityMatrix: Map<string, Map<string, number>>, onProgress: (progress: ProcessingProgress) => void): ConversationGraph {
    onProgress({
      stage: 'graph',
      progress: 85,
      message: 'Building 3D graph structure...'
    });

    const defaultControls: VisualizationControls = {
      similarityThreshold: 0.7,
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

    return graph;
  }

  /**
   * Rebuilds the conversation graph with new visualization controls.
   * @param conversations The conversations.
   * @param embeddings The conversation embeddings.
   * @param similarityMatrix The similarity matrix.
   * @param controls The new visualization controls.
   * @returns A promise that resolves with the rebuilt conversation graph.
   */
  async rebuildGraph(
    conversations: Conversation[],
    embeddings: ConversationEmbedding[],
    similarityMatrix: Map<string, Map<string, number>>,
    controls: VisualizationControls
  ): Promise<ConversationGraph> {
    return this.graphBuilder.buildGraph(conversations, embeddings, similarityMatrix, controls);
  }

  /**
   * Validates a Google AI API key.
   * @param apiKey The API key to validate.
   * @returns True if the API key is valid, false otherwise.
   */
  private validateApiKey(apiKey: string): boolean {
    return Boolean(apiKey && apiKey.trim().length > 30 && apiKey.startsWith('AIza'));
  }

  /**
   * Gets processing statistics for a conversation graph.
   * @param graph The conversation graph.
   * @returns The processing statistics.
   */
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