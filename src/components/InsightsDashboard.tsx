'use client'

import { useMemo } from 'react'
import { ConversationGraph } from '@/types'
import { BarChart3, TrendingUp, MessageSquare, Hash, Users, Activity, Brain, Network } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { motion } from 'motion/react'

interface InsightsDashboardProps {
  graph: ConversationGraph
}

export function InsightsDashboard({ graph }: InsightsDashboardProps) {
  const insights = useMemo(() => {
    const conversations = graph.nodes.map(node => node.conversation)
    if (conversations.length === 0) return null

    const totalConversations = conversations.length
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.metadata.messageCount, 0)
    const totalWords = conversations.reduce((sum, conv) => sum + conv.metadata.wordCount, 0)

    const allTopics = conversations.flatMap(conv => conv.metadata.topics)
    const topicCounts = new Map<string, number>()
    allTopics.forEach(topic => topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1))
    const topTopics = Array.from(topicCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)

    const clusterSizes = graph.clusters.map(cluster => cluster.size)
    const avgClusterSize = clusterSizes.length > 0 ? Math.round(clusterSizes.reduce((sum, size) => sum + size, 0) / clusterSizes.length) : 0

    // Sentiment analysis
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 }
    conversations.forEach(conv => {
      sentimentCounts[conv.metadata.sentiment]++
    })

    return {
      totalConversations,
      totalMessages,
      totalWords,
      avgMessagesPerConv: Math.round(totalMessages / totalConversations),
      avgWordsPerConv: Math.round(totalWords / totalConversations),
      topTopics,
      avgClusterSize,
      totalClusters: graph.clusters.length,
      sentimentCounts,
      totalConnections: graph.edges.length
    }
  }, [graph])

  if (!insights) {
    return (
      <div className="p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Brain className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No data to display insights.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg glass">
            <BarChart3 className="w-6 h-6" />
            <h2 className="text-2xl md:text-3xl font-medium">Neural Insights</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deep analysis of your conversation patterns and knowledge landscape
          </p>
        </motion.header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Total Conversations",
              value: insights.totalConversations,
              subtitle: "Knowledge sessions",
              delay: 0.1
            },
            {
              icon: Hash,
              title: "Total Messages",
              value: insights.totalMessages.toLocaleString(),
              subtitle: `Avg ${insights.avgMessagesPerConv} per conversation`,
              delay: 0.2
            },
            {
              icon: TrendingUp,
              title: "Total Words",
              value: insights.totalWords.toLocaleString(),
              subtitle: `Avg ${insights.avgWordsPerConv} per conversation`,
              delay: 0.3
            },
            {
              icon: Network,
              title: "Neural Connections",
              value: insights.totalConnections,
              subtitle: `${insights.totalClusters} identified clusters`,
              delay: 0.4
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: metric.delay }}
            >
              <Card className="glass card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-accent/30">
                      <metric.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary" className="glass">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-medium mb-1">{metric.value}</div>
                  <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-medium">
                  <div className="p-2 rounded-lg bg-accent/30">
                    <Brain className="w-5 h-5" />
                  </div>
                  Knowledge Domains
                </CardTitle>
                <CardDescription>
                  Most discussed topics in your conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.topTopics.length > 0 ? (
                  insights.topTopics.map(([topic, count], index) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-foreground/60" />
                          <span className="font-medium capitalize">{topic}</span>
                        </div>
                        <Badge variant="outline" className="glass">
                          {count} conversations
                        </Badge>
                      </div>
                      <Progress 
                        value={(count / insights.totalConversations) * 100} 
                        className="h-1"
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No topics identified yet
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sentiment Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-medium">
                  <div className="p-2 rounded-lg bg-accent/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  Conversation Sentiment
                </CardTitle>
                <CardDescription>
                  Emotional tone analysis of your discussions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { 
                    label: 'Positive', 
                    count: insights.sentimentCounts.positive, 
                    color: 'bg-green-400/20',
                    textColor: 'text-green-400'
                  },
                  { 
                    label: 'Neutral', 
                    count: insights.sentimentCounts.neutral, 
                    color: 'bg-muted-foreground/20',
                    textColor: 'text-muted-foreground'
                  },
                  { 
                    label: 'Negative', 
                    count: insights.sentimentCounts.negative, 
                    color: 'bg-red-400/20',
                    textColor: 'text-red-400'
                  }
                ].map((sentiment, index) => (
                  <motion.div
                    key={sentiment.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`p-4 rounded-lg ${sentiment.color} border border-current/20`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${sentiment.textColor}`}>
                        {sentiment.label}
                      </span>
                      <Badge variant="secondary" className="glass">
                        {sentiment.count}
                      </Badge>
                    </div>
                    <Progress 
                      value={(sentiment.count / insights.totalConversations) * 100}
                      className="h-1"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {((sentiment.count / insights.totalConversations) * 100).toFixed(1)}% of conversations
                    </p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Cluster Analysis */}
        {graph.clusters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-medium">
                  <div className="p-2 rounded-lg bg-accent/30">
                    <Users className="w-5 h-5" />
                  </div>
                  Neural Clusters
                </CardTitle>
                <CardDescription>
                  Identified conversation groups and their characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {graph.clusters.map((cluster, index) => (
                    <motion.div
                      key={cluster.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="p-4 rounded-lg glass border border-border/50 card-hover"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: cluster.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{cluster.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {cluster.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="glass">
                          {cluster.size} conversations
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Cluster #{index + 1}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}