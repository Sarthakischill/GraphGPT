"use client";

import { useState, useContext } from "react";
import { ConversationGraph, VisualizationControls } from "@/types";
import { ControlPanel } from "@/components/ControlPanel";
import { Graph3D } from "@/components/Graph3D";
import { ConversationDetail } from "@/components/ConversationDetail";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import {
  Settings,
  BarChart3,
  AppWindow,
  BrainCircuit,
  Home,
  Upload,
  Menu,
  X,
} from "lucide-react";
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
  CardDescription,
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
  const [controls, setControls] = useState<VisualizationControls>({
    similarityThreshold: 0.7,
    clusteringAlgorithm: "similarity",
    nodeSize: "messageCount",
    colorScheme: "cluster",
    showEdges: true,
    edgeThickness: 1,
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const selectedNode = selectedNodeId
    ? graph.nodes.find((node) => node.id === selectedNodeId)
    : null;

  const handleControlsChange = async (newControls: VisualizationControls) => {
    setControls(newControls);
    const rebuiltGraph = await rebuildGraphWithControls(newControls);
    if (rebuiltGraph) {
      setGraph(rebuiltGraph);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-border/50 glass"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Neural Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {graph.nodes.length} conversations • {graph.clusters.length} clusters
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="glass hidden sm:flex">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 status-online" />
            Live Analysis
          </Badge>
          
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
                  <Settings className="w-5 h-5 text-primary" />
                  Visualization Controls
                </SheetTitle>
              </SheetHeader>
              <ControlPanel
                controls={controls}
                onControlsChange={handleControlsChange}
                graph={graph}
              />
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>

      <div className="flex-1 flex overflow-hidden">
        <Tabs defaultValue="graph" className="w-full flex">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex flex-col border-r border-border/50 glass transition-all duration-300 ${
              sidebarCollapsed ? "w-16" : "w-64"
            }`}
          >
            {/* Collapse/Expand Button */}
            <div className="p-4 border-b border-border/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="btn-hover w-full"
              >
                {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            </div>

            <TabsList
              className={`flex flex-col h-full bg-transparent p-4 gap-2 ${
                sidebarCollapsed ? "items-center" : ""
              }`}
            >
              <TabsTrigger
                value="graph"
                className={`${
                  sidebarCollapsed
                    ? "w-12 h-12 p-0"
                    : "w-full justify-start gap-3 h-12 px-4"
                } btn-hover glass`}
              >
                <BrainCircuit className="w-5 h-5 text-primary" />
                {!sidebarCollapsed && <span className="font-medium">Neural Map</span>}
              </TabsTrigger>
              
              <TabsTrigger
                value="insights"
                className={`${
                  sidebarCollapsed
                    ? "w-12 h-12 p-0"
                    : "w-full justify-start gap-3 h-12 px-4"
                } btn-hover glass`}
              >
                <BarChart3 className="w-5 h-5 text-primary" />
                {!sidebarCollapsed && <span className="font-medium">Insights</span>}
              </TabsTrigger>
              
              <TabsTrigger
                value="conversations"
                className={`${
                  sidebarCollapsed
                    ? "w-12 h-12 p-0"
                    : "w-full justify-start gap-3 h-12 px-4"
                } btn-hover glass`}
              >
                <AppWindow className="w-5 h-5 text-primary" />
                {!sidebarCollapsed && <span className="font-medium">Explorer</span>}
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative">
            <TabsContent
              value="graph"
              className="h-full w-full m-0"
              style={{ height: "100%" }}
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full relative"
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
                      <div className="relative">
                        <BrainCircuit className="w-16 h-16 text-primary mx-auto pulse-glow" />
                        <div className="absolute inset-0 w-16 h-16 border-2 border-primary/30 rounded-full animate-ping mx-auto" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">Preparing Neural Map</p>
                        <p className="text-muted-foreground">Processing conversation data...</p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent
              value="insights"
              className="h-full w-full m-0 overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <InsightsDashboard graph={graph} />
              </motion.div>
            </TabsContent>

            <TabsContent
              value="conversations"
              className="h-full w-full m-0 overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Conversation Explorer</h2>
                  <p className="text-muted-foreground">
                    Browse and explore all your conversations
                  </p>
                </div>
                
                <div className="grid gap-4">
                  {graph.nodes.map((node) => (
                    <motion.div
                      key={node.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="cursor-pointer card-hover glass"
                        onClick={() => setSelectedNodeId(node.id)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg line-clamp-2">
                                {node.conversation.title}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-4 mt-2">
                                <span>{node.conversation.messages.length} messages</span>
                                <span>{node.conversation.metadata.wordCount} words</span>
                                <Badge variant="secondary" className="glass">
                                  {node.conversation.metadata.sentiment}
                                </Badge>
                              </CardDescription>
                            </div>
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0 mt-1" 
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
                              {node.conversation.metadata.topics.slice(0, 3).map(topic => (
                                <Badge key={topic} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Right Panel - Conversation Detail */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-96 border-l border-border/50 glass flex-shrink-0"
          >
            <ConversationDetail
              conversation={selectedNode.conversation}
              onClose={() => setSelectedNodeId(null)}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}