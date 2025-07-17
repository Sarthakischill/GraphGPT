'use client'

import { useMemo } from 'react'
import { ConversationGraph } from '@/types'
import { BarChart3, TrendingUp, MessageSquare, Calendar, Hash, Users, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

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

    return {
      totalConversations,
      totalMessages,
      totalWords,
      avgMessagesPerConv: Math.round(totalMessages / totalConversations),
      avgWordsPerConv: Math.round(totalWords / totalConversations),
      topTopics,
      avgClusterSize,
      totalClusters: graph.clusters.length
    }
  }, [graph])

  if (!insights) {
    return <div className="p-6 text-center text-muted-foreground">No data to display insights.</div>
  }

  return (
    <div className="p-4 md:p-8 overflow-y-auto h-full">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Conversation Insights
          </h2>
          <p className="text-muted-foreground mt-2">A high-level overview of your conversation landscape.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="w-5 h-5" />Total Conversations</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{insights.totalConversations}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Hash className="w-5 h-5" />Total Messages</CardTitle><CardDescription>Avg {insights.avgMessagesPerConv} per conversation</CardDescription></CardHeader><CardContent><p className="text-3xl font-bold">{insights.totalMessages.toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="w-5 h-5" />Total Words</CardTitle><CardDescription>Avg {insights.avgWordsPerConv} per conversation</CardDescription></CardHeader><CardContent><p className="text-3xl font-bold">{insights.totalWords.toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="w-5 h-5" />Identified Clusters</CardTitle><CardDescription>Avg {insights.avgClusterSize} conversations each</CardDescription></CardHeader><CardContent><p className="text-3xl font-bold">{insights.totalClusters}</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle>Most Discussed Topics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {insights.topTopics.map(([topic, count]) => (
                <div key={topic}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium capitalize">{topic}</span>
                    <span className="text-muted-foreground">{count} conversations</span>
                  </div>
                  <Progress value={(count / insights.totalConversations) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>

          {graph.clusters.length > 0 && (
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle>Conversation Clusters</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {graph.clusters.map(cluster => (
                  <div key={cluster.id} className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: cluster.color }} />
                    <div className="flex-1">
                      <h4 className="font-medium">{cluster.name}</h4>
                      <p className="text-sm text-muted-foreground">{cluster.description}</p>
                    </div>
                    <Badge variant="outline">{cluster.size}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}