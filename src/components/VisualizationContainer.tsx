// chat-history-visualizer/src/components/VisualizationContainer.tsx
"use client";

import { useState, useContext, useEffect, useCallback } from "react";
import { ConversationGraph, VisualizationControls } from "@/types";
import { ControlPanel } from "@/components/ControlPanel";
import { Graph3D } from "@/components/Graph3D";
import { ConversationDetail } from "@/components/ConversationDetail";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import { Settings, BarChart3, AppWindow, BrainCircuit } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { GraphDataContext } from "@/context/GraphDataContext";
import { motion } from "motion/react";

interface VisualizationContainerProps {
  initialGraph: ConversationGraph;
}

export function VisualizationContainer({
  initialGraph,
}: VisualizationContainerProps) {
  const { rebuildGraphWithControls } = useContext(GraphDataContext);
  const [graph, setGraph] = useState<ConversationGraph>(initialGraph);
  const [activeTab, setActiveTab] = useState<string>("graph");
  const [controls, setControls] = useState<VisualizationControls>({
    similarityThreshold: 0.7,
    clusteringAlgorithm: "similarity",
    nodeSize: "messageCount",
    colorScheme: "cluster",
    showEdges: true,
    edgeThickness: 1,
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = selectedNodeId
    ? graph.nodes.find((node) => node.id === selectedNodeId)
    : null;

  const handleControlsChange = useCallback(async (newControls: VisualizationControls) => {
    setControls(newControls);
    const rebuiltGraph = await rebuildGraphWithControls(newControls);
    if (rebuiltGraph) {
      setGraph(rebuiltGraph);
    }
  }, [rebuildGraphWithControls]);

  useEffect(() => {
    handleControlsChange(controls);
  }, [controls, handleControlsChange]);

  // Close conversation details when switching tabs
  useEffect(() => {
    if (selectedNodeId) {
      setSelectedNodeId(null);
    }
  }, [activeTab, selectedNodeId]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Tabs
        defaultValue="graph"
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        {/* Header with Tabs */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-8 py-6 border-b border-border/50"
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-6 h-6" />
              <div>
                <h1 className="text-lg font-medium">Neural Visualizer</h1>
                <p className="text-sm text-muted-foreground">
                  {graph.nodes.length} conversations • {graph.clusters.length}{" "}
                  clusters
                </p>
              </div>
            </div>

            {/* Tabs in Header */}
            <TabsList className="bg-transparent border border-border/50 glass">
              <TabsTrigger
                value="graph"
                className="flex items-center gap-2 btn-hover"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Neural Map</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex items-center gap-2 btn-hover"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger
                value="conversations"
                className="flex items-center gap-2 btn-hover"
              >
                <AppWindow className="w-4 h-4" />
                <span>Explorer</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex items-center gap-3">
            {/* Graph Control Instructions - Only show in Neural Map tab */}
            {activeTab === "graph" && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-2.5 rounded-lg glass text-xs text-muted-foreground">
                <span className="font-medium">Controls:</span>
                <span>🖱️ Drag to rotate</span>
                <span>•</span>
                <span>🔍 Scroll to zoom</span>
                <span>•</span>
                <span>👆 Click nodes</span>
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="btn-hover glass">
                  <Settings className="w-4 h-4 mr-2" />
                  Controls
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] p-0 glass">
                <SheetHeader className="p-6 pb-2 border-b border-border/50">
                  <SheetTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Visualization Controls
                  </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto h-full">
                  <ControlPanel
                    controls={controls}
                    onControlsChange={handleControlsChange}
                    graph={graph}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Neural Map Tab - with side panel */}
          <TabsContent
            value="graph"
            className="h-full w-full flex"
            style={{ height: "100%" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full relative flex-1"
              style={{ height: "100%" }}
            >
              {graph && graph.nodes && graph.nodes.length > 0 ? (
                <Graph3D
                  graph={graph}
                  controls={controls}
                  onNodeClick={setSelectedNodeId}
                  selectedNodeId={selectedNodeId}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <BrainCircuit className="w-12 h-12 mx-auto animate-pulse" />
                    <div>
                      <p className="font-medium">Preparing Neural Map</p>
                      <p className="text-muted-foreground text-sm">
                        Processing conversation data...
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Right Panel - Conversation Detail - Only show in graph tab */}
            {selectedNode && activeTab === "graph" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-96 border-l border-border/50 flex-shrink-0"
              >
                <ConversationDetail
                  conversation={selectedNode.conversation}
                  onClose={() => setSelectedNodeId(null)}
                />
              </motion.div>
            )}
          </TabsContent>

          {/* Insights Tab - full width */}
          <TabsContent
            value="insights"
            className="h-full w-full overflow-y-auto"
          >
            <div className="h-full">
              <InsightsDashboard graph={graph} />
            </div>
          </TabsContent>

          {/* Explorer Tab - with side-by-side layout */}
          <TabsContent
            value="conversations"
            className="h-full w-full flex"
            style={{ height: "100%" }}
          >
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
                        setSelectedNodeId(node.id);
                        // Stay in Explorer tab - don't switch tabs
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
            {selectedNode && activeTab === "conversations" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-96 border-l border-border/50 flex-shrink-0"
              >
                <ConversationDetail
                  conversation={selectedNode.conversation}
                  onClose={() => setSelectedNodeId(null)}
                />
              </motion.div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
