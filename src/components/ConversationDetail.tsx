'use client'

import { useState } from 'react'
import { Conversation } from '@/types'
import { X, Calendar, MessageCircle, Hash, User, Bot, Copy, Check, Clock, Heart, Brain } from 'lucide-react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { motion } from 'motion/react'

interface ConversationDetailProps {
  conversation: Conversation
  onClose: () => void
}

export function ConversationDetail({ conversation, onClose }: ConversationDetailProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date)
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Heart className="w-4 h-4 text-green-400" />
      case 'negative': return <X className="w-4 h-4 text-red-400" />
      default: return <Brain className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-400/30 bg-green-400/5'
      case 'negative': return 'border-red-400/30 bg-red-400/5'
      default: return 'border-border/50 bg-accent/10'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-border/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-lg mb-3 line-clamp-2 leading-tight">
              {conversation.title}
            </h2>
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(conversation.metadata.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{conversation.metadata.messageCount} messages</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span>{conversation.metadata.wordCount} words</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{Math.ceil(conversation.metadata.wordCount / 200)} min read</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="flex-shrink-0 btn-hover"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/30">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Summary</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {conversation.summary}
                    </p>
                  </div>
                </div>
                
                {/* Sentiment & Topics */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(conversation.metadata.sentiment)}
                    <Badge 
                      variant="secondary" 
                      className={`glass ${getSentimentColor(conversation.metadata.sentiment)}`}
                    >
                      {conversation.metadata.sentiment}
                    </Badge>
                  </div>
                  
                  {conversation.metadata.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {conversation.metadata.topics.slice(0, 3).map(topic => (
                        <Badge key={topic} variant="outline" className="text-xs glass">
                          {topic}
                        </Badge>
                      ))}
                      {conversation.metadata.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs glass">
                          +{conversation.metadata.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Conversation Flow
            </h3>
            
            <div className="space-y-4">
              {conversation.messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.role === 'user' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`group relative ${
                    message.role === 'user' ? 'ml-4' : 'mr-4'
                  }`}
                >
                  <Card className={`glass transition-smooth ${
                    message.role === 'user' 
                      ? 'border-muted-foreground/20 bg-accent/10' 
                      : 'border-border/50 bg-card/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${
                            message.role === 'user' 
                              ? 'bg-muted-foreground/20' 
                              : 'bg-accent/30'
                          }`}>
                            {message.role === 'user' ? (
                              <User className="w-3 h-3" />
                            ) : (
                              <Bot className="w-3 h-3" />
                            )}
                          </div>
                          <span className="font-medium text-sm capitalize">
                            {message.role}
                          </span>
                          <Badge variant="outline" className="text-xs glass">
                            {message.wordCount} words
                          </Badge>
                        </div>
                        
                        <Button
                          onClick={() => copyToClipboard(message.content, `${index}`)}
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity btn-hover"
                          title="Copy message"
                        >
                          {copiedMessageId === `${index}` ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  )
}