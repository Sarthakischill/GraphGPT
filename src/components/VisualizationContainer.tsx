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
import { GraphDataContext } from "@/context/GraphDataContext";

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

  // Debug: Log the graph data
  console.log("VisualizationContainer: Graph data", {
    nodeCount: graph?.nodes?.length || 0,
    edgeCount: graph?.edges?.length || 0,
    clusterCount: graph?.clusters?.length || 0,
    hasGraph: !!graph,
    firstNode: graph?.nodes?.[0],
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
      <header className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Conversation Dashboard</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Controls
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[350px] sm:w-[400px] p-0">
            <SheetHeader className="p-6 pb-2">
              <SheetTitle>Visualization Controls</SheetTitle>
            </SheetHeader>
            <ControlPanel
              controls={controls}
              onControlsChange={handleControlsChange}
              graph={graph}
            />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Tabs defaultValue="graph" className="w-full flex">
          <div
            className={`flex flex-col border-r transition-all duration-300 ${
              sidebarCollapsed ? "w-12" : "w-auto"
            }`}
          >
            {/* Collapse/Expand Button */}
            <div className="p-2 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-8 h-8"
              >
                {sidebarCollapsed ? "→" : "←"}
              </Button>
            </div>

            <TabsList
              className={`flex flex-col h-full bg-transparent p-2 ${
                sidebarCollapsed ? "items-center" : ""
              }`}
            >
              <TabsTrigger
                value="graph"
                className={`${
                  sidebarCollapsed
                    ? "w-8 h-8 p-0"
                    : "w-full justify-start gap-2 h-12"
                }`}
              >
                <BrainCircuit className="w-5 h-5" />
                {!sidebarCollapsed && <span>Neural Map</span>}
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className={`${
                  sidebarCollapsed
                    ? "w-8 h-8 p-0"
                    : "w-full justify-start gap-2 h-12"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                {!sidebarCollapsed && <span>Insights</span>}
              </TabsTrigger>
              <TabsTrigger
                value="conversations"
                className={`${
                  sidebarCollapsed
                    ? "w-8 h-8 p-0"
                    : "w-full justify-start gap-2 h-12"
                }`}
              >
                <AppWindow className="w-5 h-5" />
                {!sidebarCollapsed && <span>Explorer</span>}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <TabsContent
              value="graph"
              className="h-full w-full m-0"
              style={{ height: "100%" }}
            >
              <div className="w-full h-full" style={{ height: "100%" }}>
                {graph && graph.nodes && graph.nodes.length > 0 ? (
                  <Graph3D
                    graph={graph}
                    controls={controls}
                    onNodeClick={setSelectedNodeId}
                    selectedNodeId={selectedNodeId}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <BrainCircuit className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
                      <p className="text-muted-foreground text-lg">
                        Preparing neural map...
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Processing conversation data
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="insights"
              className="h-full w-full m-0 overflow-y-auto"
            >
              <InsightsDashboard graph={graph} />
            </TabsContent>

            <TabsContent
              value="conversations"
              className="h-full w-full m-0 overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">All Conversations</h2>
                <div className="space-y-4">
                  {graph.nodes.map((node) => (
                    <Card
                      key={node.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {node.conversation.title}
                        </CardTitle>
                        <CardDescription>
                          {node.conversation.messages.length} messages •{" "}
                          {node.conversation.metadata.wordCount} words
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {node.conversation.summary}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Right Panel - Conversation Detail */}
        {selectedNode && (
          <div className="w-96 border-l flex-shrink-0">
            <ConversationDetail
              conversation={selectedNode.conversation}
              onClose={() => setSelectedNodeId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
