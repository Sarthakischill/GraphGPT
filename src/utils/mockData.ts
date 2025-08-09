import { Conversation, ConversationEmbedding } from '@/types';

export const generateMockEmbeddings = (conversations: Conversation[]): ConversationEmbedding[] => {
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

export const calculateMockSimilarityMatrix = (embeddings: ConversationEmbedding[]): Map<string, Map<string, number>> => {
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
