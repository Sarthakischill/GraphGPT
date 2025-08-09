import { ConversationGraph } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConversationDetail } from "@/components/ConversationDetail";
import { motion } from "motion/react";

interface ExplorerViewProps {
  graph: ConversationGraph;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

export function ExplorerView({ graph, selectedNodeId, onNodeSelect }: ExplorerViewProps) {
  const selectedNode = selectedNodeId
    ? graph.nodes.find((node) => node.id === selectedNodeId)
    : null;

  return (
    <div className="h-full w-full flex">
      {/* Left Panel - Conversation List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">
            Conversation Explorer
          </h2>
          <p className="text-muted-foreground">
            Browse and explore all your conversations
          </p>
        </div>

        <div className="grid gap-4">
          {graph.nodes.map((node) => (
            <div key={node.id}>
              <Card
                className={`cursor-pointer card-hover glass transition-all ${
                  selectedNodeId === node.id
                    ? "ring-2 ring-primary/50 bg-primary/5"
                    : ""
                }`}
                onClick={() => {
                  onNodeSelect(node.id);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium line-clamp-2">
                        {node.conversation.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                        <span>
                          {node.conversation.messages.length} messages
                        </span>
                        <span>
                          {node.conversation.metadata.wordCount} words
                        </span>
                        <Badge variant="secondary" className="glass">
                          {node.conversation.metadata.sentiment}
                        </Badge>
                      </div>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {node.conversation.summary}
                  </p>
                  {node.conversation.metadata.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {node.conversation.metadata.topics
                        .slice(0, 3)
                        .map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Conversation Detail (only in Explorer tab) */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="w-96 border-l border-border/50 flex-shrink-0"
        >
          <ConversationDetail
            conversation={selectedNode.conversation}
            onClose={() => onNodeSelect(null)}
          />
        </motion.div>
      )}
    </div>
  );
}
