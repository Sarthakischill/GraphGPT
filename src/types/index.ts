// Core conversation types
export interface RawConversation {
  id: string;
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, ConversationNode>;
  moderation_results: unknown[];
  current_node: string;
}

export interface ConversationNode {
  id: string;
  message?: {
    id: string;
    author: {
      role: 'user' | 'assistant' | 'system';
    };
    content: {
      content_type: string;
      parts: string[];
    };
    create_time: number;
  };
  parent: string | null;
  children: string[];
}

export interface ProcessedMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  wordCount: number;
}

export interface Conversation {
  id: string;
  title: string;
  summary: string;
  messages: ProcessedMessage[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
    wordCount: number;
    topics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

// Embedding and similarity types
export interface ConversationEmbedding {
  conversationId: string;
  embedding: number[];
  metadata: {
    wordCount: number;
    topicKeywords: string[];
    generatedAt: Date;
  };
}

// Graph visualization types
export interface GraphNode {
  id: string;
  conversation: Conversation;
  position: { x: number; y: number; z: number };
  size: number;
  color: string;
  cluster?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  similarity: number;
}

export interface ConversationGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  clusters: ConversationCluster[];
}

export interface ConversationCluster {
  id: string;
  name: string;
  description: string;
  conversations: string[];
  centroid: number[];
  color: string;
  size: number;
}

// Visualization control types
export interface VisualizationControls {
  similarityThreshold: number;
  clusteringAlgorithm: 'topic' | 'chronological' | 'similarity';
  nodeSize: 'messageCount' | 'wordCount' | 'uniform';
  colorScheme: 'cluster' | 'chronological' | 'topic';
  showEdges: boolean;
  edgeThickness: number;
}

// File processing types
export interface ChatExportFile {
  conversations?: RawConversation[];
  metadata?: {
    exportDate: string;
    version: string;
    totalConversations: number;
  };
}

export interface ProcessingProgress {
  stage: 'parsing' | 'cleaning' | 'embedding' | 'similarity' | 'graph' | 'complete';
  progress: number;
  message: string;
  error?: string;
}

// API types
export interface EmbeddingRequest {
  texts: string[];
  model: string;
  dimensions?: number;
}

export interface EmbeddingResponse {
  embeddings: {
    embedding: number[];
    index: number;
  }[];
  usage: {
    totalTokens: number;
  };
}