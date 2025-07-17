import { 
  Conversation, 
  ConversationEmbedding, 
  ConversationGraph, 
  GraphNode, 
  GraphEdge, 
  ConversationCluster,
  VisualizationControls 
} from '@/types';

export class GraphBuilder {
  buildGraph(
    conversations: Conversation[],
    embeddings: ConversationEmbedding[],
    similarityMatrix: Map<string, Map<string, number>>,
    controls: VisualizationControls
  ): ConversationGraph {
    const nodes = this.createNodes(conversations, controls);
    const edges = this.createEdges(similarityMatrix, controls.similarityThreshold);
    const clusters = this.identifyClusters(nodes, edges, embeddings);

    // Apply clustering colors to nodes
    this.applyClusterColors(nodes, clusters, controls.colorScheme);

    return { nodes, edges, clusters };
  }

  private createNodes(conversations: Conversation[], controls: VisualizationControls): GraphNode[] {
    return conversations.map((conversation, index) => {
      const size = this.calculateNodeSize(conversation, controls.nodeSize);
      const position = this.generateInitialPosition(index, conversations.length);

      return {
        id: conversation.id,
        conversation,
        position,
        size,
        color: this.getInitialNodeColor(conversation, controls.colorScheme),
        cluster: undefined // Will be set by clustering algorithm
      };
    });
  }

  private createEdges(
    similarityMatrix: Map<string, Map<string, number>>,
    threshold: number
  ): GraphEdge[] {
    const edges: GraphEdge[] = [];

    for (const [sourceId, similarities] of similarityMatrix) {
      for (const [targetId, similarity] of similarities) {
        if (sourceId !== targetId && similarity >= threshold) {
          edges.push({
            source: sourceId,
            target: targetId,
            weight: similarity,
            similarity
          });
        }
      }
    }

    return edges;
  }

  private identifyClusters(
    nodes: GraphNode[],
    edges: GraphEdge[],
    embeddings: ConversationEmbedding[]
  ): ConversationCluster[] {
    // Simple clustering based on connected components
    const clusters: ConversationCluster[] = [];
    const visited = new Set<string>();
    const adjacencyList = this.buildAdjacencyList(edges);

    let clusterId = 0;
    for (const node of nodes) {
      if (visited.has(node.id)) continue;

      const clusterNodes = this.findConnectedComponent(node.id, adjacencyList, visited);
      if (clusterNodes.length >= 2) { // Only create clusters with 2+ nodes
        const cluster = this.createCluster(
          `cluster-${clusterId++}`,
          clusterNodes,
          nodes,
          embeddings
        );
        clusters.push(cluster);

        // Assign cluster to nodes
        clusterNodes.forEach(nodeId => {
          const node = nodes.find(n => n.id === nodeId);
          if (node) node.cluster = cluster.id;
        });
      }
    }

    return clusters;
  }

  private buildAdjacencyList(edges: GraphEdge[]): Map<string, string[]> {
    const adjacencyList = new Map<string, string[]>();

    for (const edge of edges) {
      if (!adjacencyList.has(edge.source)) {
        adjacencyList.set(edge.source, []);
      }
      if (!adjacencyList.has(edge.target)) {
        adjacencyList.set(edge.target, []);
      }

      adjacencyList.get(edge.source)!.push(edge.target);
      adjacencyList.get(edge.target)!.push(edge.source);
    }

    return adjacencyList;
  }

  private findConnectedComponent(
    startNodeId: string,
    adjacencyList: Map<string, string[]>,
    visited: Set<string>
  ): string[] {
    const component: string[] = [];
    const stack = [startNodeId];

    while (stack.length > 0) {
      const nodeId = stack.pop()!;
      if (visited.has(nodeId)) continue;

      visited.add(nodeId);
      component.push(nodeId);

      const neighbors = adjacencyList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    return component;
  }

  private createCluster(
    id: string,
    nodeIds: string[],
    allNodes: GraphNode[],
    embeddings: ConversationEmbedding[]
  ): ConversationCluster {
    const clusterNodes = allNodes.filter(node => nodeIds.includes(node.id));
    const clusterEmbeddings = embeddings.filter(emb => nodeIds.includes(emb.conversationId));

    // Calculate centroid
    const centroid = this.calculateCentroid(clusterEmbeddings);

    // Generate cluster name based on common topics
    const name = this.generateClusterName(clusterNodes);
    const description = this.generateClusterDescription(clusterNodes);

    return {
      id,
      name,
      description,
      conversations: nodeIds,
      centroid,
      color: this.generateClusterColor(id),
      size: nodeIds.length
    };
  }

  private calculateCentroid(embeddings: ConversationEmbedding[]): number[] {
    if (embeddings.length === 0) return [];

    const dimensions = embeddings[0].embedding.length;
    const centroid = new Array(dimensions).fill(0);

    for (const embedding of embeddings) {
      for (let i = 0; i < dimensions; i++) {
        centroid[i] += embedding.embedding[i];
      }
    }

    for (let i = 0; i < dimensions; i++) {
      centroid[i] /= embeddings.length;
    }

    return centroid;
  }

  private generateClusterName(nodes: GraphNode[]): string {
    // Extract common topics from conversations
    const allTopics = nodes.flatMap(node => node.conversation.metadata.topics);
    const topicCounts = new Map<string, number>();

    allTopics.forEach(topic => {
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    });

    const sortedTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([topic]) => topic);

    if (sortedTopics.length > 0) {
      return sortedTopics.join(' & ');
    }

    return `Cluster (${nodes.length} conversations)`;
  }

  private generateClusterDescription(nodes: GraphNode[]): string {
    const totalMessages = nodes.reduce((sum, node) => sum + node.conversation.metadata.messageCount, 0);
    const avgMessages = Math.round(totalMessages / nodes.length);
    
    return `${nodes.length} conversations with an average of ${avgMessages} messages each`;
  }

  private generateClusterColor(clusterId: string): string {
    const colors = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#8B5CF6', // Purple
      '#F97316', // Orange
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#EC4899', // Pink
      '#6B7280'  // Gray
    ];

    const hash = clusterId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  private calculateNodeSize(conversation: Conversation, sizeMode: string): number {
    const baseSize = 4;
    const maxSize = 20;

    switch (sizeMode) {
      case 'messageCount':
        return Math.min(baseSize + (conversation.metadata.messageCount * 0.5), maxSize);
      case 'wordCount':
        return Math.min(baseSize + (conversation.metadata.wordCount * 0.01), maxSize);
      case 'uniform':
      default:
        return baseSize;
    }
  }

  private generateInitialPosition(index: number, total: number): { x: number; y: number; z: number } {
    // Distribute nodes in a sphere
    const phi = Math.acos(1 - 2 * (index + 0.5) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
    const radius = 100;

    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi)
    };
  }

  private getInitialNodeColor(conversation: Conversation, colorScheme: string): string {
    switch (colorScheme) {
      case 'chronological':
        return this.getChronologicalColor(conversation.metadata.createdAt);
      case 'topic':
        return this.getTopicColor(conversation.metadata.topics[0] || 'general');
      case 'cluster':
      default:
        return '#6B7280'; // Default gray, will be overridden by clustering
    }
  }

  private getChronologicalColor(date: Date): string {
    const now = new Date();
    const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 30) return '#10B981'; // Green - Recent
    if (daysDiff < 90) return '#F59E0B'; // Yellow - Medium
    if (daysDiff < 180) return '#F97316'; // Orange - Old
    return '#EF4444'; // Red - Very old
  }

  private getTopicColor(topic: string): string {
    const colors = new Map([
      ['code', '#3B82F6'],
      ['programming', '#3B82F6'],
      ['tech', '#3B82F6'],
      ['help', '#10B981'],
      ['question', '#10B981'],
      ['learn', '#8B5CF6'],
      ['study', '#8B5CF6'],
      ['work', '#F59E0B'],
      ['project', '#F59E0B'],
      ['general', '#6B7280']
    ]);

    for (const [keyword, color] of colors) {
      if (topic.toLowerCase().includes(keyword)) {
        return color;
      }
    }

    return '#6B7280';
  }

  private applyClusterColors(
    nodes: GraphNode[],
    clusters: ConversationCluster[],
    colorScheme: string
  ): void {
    if (colorScheme !== 'cluster') return;

    const clusterColorMap = new Map<string, string>();
    clusters.forEach(cluster => {
      clusterColorMap.set(cluster.id, cluster.color);
    });

    nodes.forEach(node => {
      if (node.cluster && clusterColorMap.has(node.cluster)) {
        node.color = clusterColorMap.get(node.cluster)!;
      }
    });
  }
}