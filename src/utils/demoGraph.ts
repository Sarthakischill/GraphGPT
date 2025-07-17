import { ConversationGraph, Conversation, GraphNode, GraphEdge, ConversationCluster } from '@/types'

export function createDemoGraph(): ConversationGraph {
  // Create demo conversations
  const demoConversations: Conversation[] = [
    {
      id: 'demo-1',
      title: 'Learning React Hooks',
      summary: 'Discussion about React hooks, useState, and useEffect with practical examples.',
      messages: [
        {
          role: 'user',
          content: 'Can you explain React hooks and how they work?',
          timestamp: new Date(Date.now() - 86400 * 7 * 1000),
          wordCount: 10
        },
        {
          role: 'assistant',
          content: 'React Hooks are functions that let you use state and other React features in functional components. The most common hooks are useState for managing state and useEffect for side effects.',
          timestamp: new Date(Date.now() - 86400 * 7 * 1000 + 60000),
          wordCount: 35
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 86400 * 7 * 1000),
        updatedAt: new Date(Date.now() - 86400 * 7 * 1000),
        messageCount: 2,
        wordCount: 45,
        topics: ['react', 'hooks', 'javascript'],
        sentiment: 'positive'
      }
    },
    {
      id: 'demo-2',
      title: 'JavaScript Array Methods',
      summary: 'Overview of essential JavaScript array methods like map, filter, and reduce.',
      messages: [
        {
          role: 'user',
          content: 'What are the most useful JavaScript array methods I should know?',
          timestamp: new Date(Date.now() - 86400 * 5 * 1000),
          wordCount: 12
        },
        {
          role: 'assistant',
          content: 'The most essential JavaScript array methods include: map() for transforming arrays, filter() for filtering elements, reduce() for aggregating data, forEach() for iteration, find() for finding elements, and includes() for checking existence.',
          timestamp: new Date(Date.now() - 86400 * 5 * 1000 + 60000),
          wordCount: 38
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 86400 * 5 * 1000),
        updatedAt: new Date(Date.now() - 86400 * 5 * 1000),
        messageCount: 2,
        wordCount: 50,
        topics: ['javascript', 'arrays', 'methods'],
        sentiment: 'neutral'
      }
    },
    {
      id: 'demo-3',
      title: 'CSS Grid vs Flexbox',
      summary: 'Comparison between CSS Grid and Flexbox layout systems and when to use each.',
      messages: [
        {
          role: 'user',
          content: 'When should I use CSS Grid vs Flexbox?',
          timestamp: new Date(Date.now() - 86400 * 3 * 1000),
          wordCount: 9
        },
        {
          role: 'assistant',
          content: 'Use CSS Grid for two-dimensional layouts (rows and columns) and complex page layouts. Use Flexbox for one-dimensional layouts (either row or column) and component-level alignment.',
          timestamp: new Date(Date.now() - 86400 * 3 * 1000 + 60000),
          wordCount: 32
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 86400 * 3 * 1000),
        updatedAt: new Date(Date.now() - 86400 * 3 * 1000),
        messageCount: 2,
        wordCount: 41,
        topics: ['css', 'grid', 'flexbox'],
        sentiment: 'neutral'
      }
    },
    {
      id: 'demo-4',
      title: 'Python Data Structures',
      summary: 'Overview of Python data structures including lists, dictionaries, sets, and tuples.',
      messages: [
        {
          role: 'user',
          content: 'What are the main data structures in Python and when to use each?',
          timestamp: new Date(Date.now() - 86400 * 10 * 1000),
          wordCount: 13
        },
        {
          role: 'assistant',
          content: 'Python\'s main data structures are: Lists (ordered, mutable), Tuples (ordered, immutable), Dictionaries (key-value pairs), Sets (unique elements), and Strings (immutable sequences).',
          timestamp: new Date(Date.now() - 86400 * 10 * 1000 + 60000),
          wordCount: 28
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 86400 * 10 * 1000),
        updatedAt: new Date(Date.now() - 86400 * 10 * 1000),
        messageCount: 2,
        wordCount: 41,
        topics: ['python', 'data', 'structures'],
        sentiment: 'positive'
      }
    },
    {
      id: 'demo-5',
      title: 'Machine Learning Basics',
      summary: 'Introduction to supervised vs unsupervised learning concepts.',
      messages: [
        {
          role: 'user',
          content: 'Can you explain the difference between supervised and unsupervised learning?',
          timestamp: new Date(Date.now() - 86400 * 2 * 1000),
          wordCount: 12
        },
        {
          role: 'assistant',
          content: 'Supervised learning uses labeled training data to learn patterns and make predictions. Unsupervised learning finds hidden patterns in unlabeled data like clustering.',
          timestamp: new Date(Date.now() - 86400 * 2 * 1000 + 60000),
          wordCount: 26
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 86400 * 2 * 1000),
        updatedAt: new Date(Date.now() - 86400 * 2 * 1000),
        messageCount: 2,
        wordCount: 38,
        topics: ['machine', 'learning', 'ai'],
        sentiment: 'positive'
      }
    }
  ]

  // Create graph nodes
  const nodes: GraphNode[] = demoConversations.map((conversation, index) => ({
    id: conversation.id,
    conversation,
    position: {
      x: Math.cos((index / demoConversations.length) * 2 * Math.PI) * 100,
      y: Math.sin((index / demoConversations.length) * 2 * Math.PI) * 100,
      z: (Math.random() - 0.5) * 50
    },
    size: 8 + conversation.metadata.wordCount * 0.1,
    color: getTopicColor(conversation.metadata.topics[0] || 'general'),
    cluster: getClusterForTopics(conversation.metadata.topics)
  }))

  // Create edges based on topic similarity
  const edges: GraphEdge[] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const similarity = calculateTopicSimilarity(
        nodes[i].conversation.metadata.topics,
        nodes[j].conversation.metadata.topics
      )
      
      if (similarity > 0.3) {
        edges.push({
          source: nodes[i].id,
          target: nodes[j].id,
          weight: similarity,
          similarity
        })
      }
    }
  }

  // Create clusters
  const clusters: ConversationCluster[] = [
    {
      id: 'frontend-cluster',
      name: 'Frontend Development',
      description: 'Conversations about React, JavaScript, and CSS',
      conversations: ['demo-1', 'demo-2', 'demo-3'],
      centroid: [0.8, 0.2, 0.1],
      color: '#3B82F6',
      size: 3
    },
    {
      id: 'backend-cluster',
      name: 'Data & AI',
      description: 'Conversations about Python, data structures, and machine learning',
      conversations: ['demo-4', 'demo-5'],
      centroid: [0.1, 0.8, 0.7],
      color: '#10B981',
      size: 2
    }
  ]

  return { nodes, edges, clusters }
}

function getTopicColor(topic: string): string {
  const colorMap: Record<string, string> = {
    'react': '#61DAFB',
    'javascript': '#F7DF1E',
    'css': '#1572B6',
    'python': '#3776AB',
    'machine': '#FF6B6B',
    'learning': '#FF6B6B',
    'ai': '#FF6B6B',
    'general': '#6B7280'
  }
  
  return colorMap[topic.toLowerCase()] || '#6B7280'
}

function getClusterForTopics(topics: string[]): string {
  const frontendTopics = ['react', 'javascript', 'css', 'html']
  const backendTopics = ['python', 'data', 'machine', 'learning', 'ai']
  
  const hasFrontend = topics.some(topic => frontendTopics.includes(topic.toLowerCase()))
  const hasBackend = topics.some(topic => backendTopics.includes(topic.toLowerCase()))
  
  if (hasFrontend) return 'frontend-cluster'
  if (hasBackend) return 'backend-cluster'
  return 'general-cluster'
}

function calculateTopicSimilarity(topics1: string[], topics2: string[]): number {
  const set1 = new Set(topics1.map(t => t.toLowerCase()))
  const set2 = new Set(topics2.map(t => t.toLowerCase()))
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}