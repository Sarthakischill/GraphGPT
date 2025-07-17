'use client'

import { useState } from 'react'
import { Conversation } from '@/types'
import { X, Calendar, MessageCircle, Hash, User, Bot, Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'

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
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg mb-2 line-clamp-2">
              {conversation.title}
            </h2>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(conversation.metadata.createdAt)}</div>
              <div className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {conversation.metadata.messageCount}</div>
              <div className="flex items-center gap-1.5"><Hash className="w-4 h-4" /> {conversation.metadata.wordCount}</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Summary */}
          <div>
            <h3 className="font-medium mb-2">Summary</h3>
            <p className="text-muted-foreground text-sm">{conversation.summary}</p>
            {conversation.metadata.topics.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-sm mb-2">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {conversation.metadata.topics.map(topic => (
                    <Badge key={topic} variant="secondary">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div>
            <h3 className="font-medium mb-4">Messages</h3>
            <div className="space-y-4">
              {conversation.messages.map((message, index) => (
                <div key={index} className="p-3 rounded-lg bg-secondary/50 border-l-2 border-primary/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="font-medium text-sm capitalize">{message.role}</span>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(message.content, `${index}`)}
                      variant="ghost" size="icon" className="h-7 w-7"
                      title="Copy message"
                    >
                      {copiedMessageId === `${index}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}