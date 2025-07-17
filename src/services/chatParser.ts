import { RawConversation, ConversationNode, Conversation, ProcessedMessage, ChatExportFile } from '@/types';

export class ChatParser {
  async parseExportFile(file: File): Promise<RawConversation[]> {
    try {
      const text = await file.text();
      const data: ChatExportFile = JSON.parse(text);
      
      // Handle different export formats
      if (Array.isArray(data)) {
        return data as RawConversation[];
      }
      
      if (data.conversations && Array.isArray(data.conversations)) {
        return data.conversations;
      }
      
      throw new Error('Invalid ChatGPT export format. Expected conversations array.');
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON file. Please ensure you uploaded a valid ChatGPT export.');
      }
      throw error;
    }
  }

  cleanConversations(rawConversations: RawConversation[]): Conversation[] {
    const cleaned: Conversation[] = [];

    for (const raw of rawConversations) {
      try {
        const messages = this.extractMessages(raw);
        
        // Filter out conversations with too few meaningful exchanges
        if (messages.length < 2) continue; // Changed from 3 to 2

        const wordCount = messages.reduce((sum, msg) => sum + msg.wordCount, 0);
        
        // Skip very short conversations
        if (wordCount < 20) continue; // Changed from 50 to 20

        const conversation: Conversation = {
          id: raw.id,
          title: raw.title || 'Untitled Conversation',
          summary: this.generateSummary(messages),
          messages,
          metadata: {
            createdAt: new Date(raw.create_time * 1000),
            updatedAt: new Date(raw.update_time * 1000),
            messageCount: messages.length,
            wordCount,
            topics: this.extractTopics(messages),
            sentiment: this.analyzeSentiment(messages)
          }
        };

        cleaned.push(conversation);
      } catch (error) {
        console.warn(`Failed to process conversation ${raw.id}:`, error);
        continue;
      }
    }

    return cleaned;
  }

  private extractMessages(conversation: RawConversation): ProcessedMessage[] {
    const messages: ProcessedMessage[] = [];

    // Build message chain from current_node backwards
    const messageChain = this.buildMessageChain(conversation.mapping, conversation.current_node);

    for (const nodeId of messageChain) {
      const node = conversation.mapping[nodeId];
      if (!node?.message) continue;

      const { message } = node;
      if (!message.content?.parts?.length) continue;

      // Skip system messages
      if (message.author.role === 'system') continue;

      const content = message.content.parts.join(' ').trim();
      if (!content) continue;

      messages.push({
        role: message.author.role as 'user' | 'assistant',
        content,
        timestamp: new Date(message.create_time * 1000),
        wordCount: this.countWords(content)
      });
    }

    return messages;
  }

  private buildMessageChain(mapping: Record<string, ConversationNode>, currentNodeId: string): string[] {
    const chain: string[] = [];
    const visited = new Set<string>();

    // Start from root and traverse to build chronological order
    const findRoot = (nodeId: string): string => {
      const node = mapping[nodeId];
      if (!node || !node.parent || visited.has(nodeId)) return nodeId;
      visited.add(nodeId);
      return findRoot(node.parent);
    };

    const root = findRoot(currentNodeId);
    
    // Traverse from root to build chain
    const traverse = (nodeId: string) => {
      const node = mapping[nodeId];
      if (!node) return;

      if (node.message) {
        chain.push(nodeId);
      }

      // Follow the main conversation path
      for (const childId of node.children) {
        traverse(childId);
      }
    };

    traverse(root);
    return chain;
  }

  private generateSummary(messages: ProcessedMessage[]): string {
    if (messages.length === 0) return 'Empty conversation';

    // Take first user message as a basic summary
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const summary = firstUserMessage.content.substring(0, 150);
      return summary.length < firstUserMessage.content.length ? summary + '...' : summary;
    }

    return 'Conversation summary unavailable';
  }

  private extractTopics(messages: ProcessedMessage[]): string[] {
    // Simple keyword extraction - in a real implementation, you'd use NLP
    const text = messages.map(m => m.content).join(' ').toLowerCase();
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
    
    const words = text.match(/\b\w{4,}\b/g) || [];
    const wordCount = new Map<string, number>();
    
    words.forEach(word => {
      if (!commonWords.has(word)) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });

    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  private analyzeSentiment(messages: ProcessedMessage[]): 'positive' | 'neutral' | 'negative' {
    // Simple sentiment analysis - in a real implementation, you'd use a proper sentiment analysis library
    const text = messages.map(m => m.content).join(' ').toLowerCase();
    
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'enjoy', 'happy', 'pleased', 'satisfied'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'sad', 'upset'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const matches = text.match(new RegExp(`\\b${word}\\b`, 'g'));
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const matches = text.match(new RegExp(`\\b${word}\\b`, 'g'));
      if (matches) negativeCount += matches.length;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }
}