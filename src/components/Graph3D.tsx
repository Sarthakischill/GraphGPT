// chat-history-visualizer/src/components/Graph3D.tsx
"use client";

import { useEffect, useRef, useState, memo } from "react";
import { ConversationGraph, VisualizationControls } from "@/types";
import { BrainCircuit } from "lucide-react";
import * as THREE from "three";

// Type definitions for 3D Force Graph
interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  conversation?: {
    metadata?: {
      messageCount?: number;
    };
  };
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface ForceGraphInstance {
  graphData: (data: GraphData) => ForceGraphInstance;
  backgroundColor: (color: string) => ForceGraphInstance;
  showNavInfo: (show: boolean) => ForceGraphInstance;
  onNodeClick: (callback: (node: GraphNode) => void) => ForceGraphInstance;
  width: (width: number) => ForceGraphInstance;
  height: (height: number) => ForceGraphInstance;
  nodeLabel: (callback: (node: GraphNode) => string) => ForceGraphInstance;
  nodeColor: (callback: (node: GraphNode) => string) => ForceGraphInstance;
  nodeVal: (callback: (node: GraphNode) => number) => ForceGraphInstance;
  linkWidth: (callback: (edge: GraphLink) => number) => ForceGraphInstance;
  linkColor: (callback: () => string) => ForceGraphInstance;
  linkOpacity: (opacity: number) => ForceGraphInstance;
  nodeThreeObject: (callback: (node: GraphNode) => THREE.Object3D) => ForceGraphInstance;
  zoomToFit: (duration?: number, padding?: number) => ForceGraphInstance;
}

interface Graph3DProps {
  graph: ConversationGraph;
  controls: VisualizationControls;
  onNodeClick: (nodeId: string) => void;
  selectedNodeId: string | null;
}

const Graph3DComponent = ({
  graph,
  controls,
  onNodeClick,
  selectedNodeId,
}: Graph3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ForceGraph3D, setForceGraph3D] = useState<unknown>(null);

  // Debug: Log the graph data
  console.log("Graph3D: Received props", {
    nodeCount: graph?.nodes?.length || 0,
    edgeCount: graph?.edges?.length || 0,
    showEdges: controls?.showEdges,
    hasGraph: !!graph,
  });

  // Dynamically import the 3D force graph library
  useEffect(() => {
    const loadForceGraph = async () => {
      try {
        const forceGraphModule = await import("3d-force-graph");
        setForceGraph3D(() => forceGraphModule.default);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load 3D force graph:", error);
        setIsLoading(false);
      }
    };
    loadForceGraph();
  }, []);

  // Initialize graph with retry logic and WebGL detection, and set initial data
  useEffect(() => {
    if (!ForceGraph3D || graphRef.current) return;

    // Check WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        console.log("WebGL support:", !!gl);
        return !!gl;
      } catch (e) {
        console.log("WebGL not supported:", e);
        return false;
      }
    };

    const webglSupported = checkWebGL();
    if (!webglSupported) {
      console.error("WebGL is not supported in this browser");
      return;
    }

    const initializeGraph = () => {
      const container = containerRef.current;
      if (!container) return false;

      // Clear any existing content
      container.innerHTML = "";

      // Use fallback dimensions if container doesn't have proper size
      const width = Math.max(container.clientWidth, container.offsetWidth, 800);
      const height = Math.max(
        container.clientHeight,
        container.offsetHeight,
        600
      );

      console.log("Graph3D: Attempting initialization", {
        containerWidth: container.clientWidth,
        containerHeight: container.clientHeight,
        offsetWidth: container.offsetWidth,
        offsetHeight: container.offsetHeight,
        usingWidth: width,
        usingHeight: height,
        webglSupported,
      });

      try {
        console.log(
          "Graph3D: Creating ForceGraph3D instance with container:",
          container
        );

        // Use the canonical double-invocation pattern for the library
        const graphInstance = (ForceGraph3D as any)()(container);

        console.log("Graph3D: ForceGraph3D instance created:", graphInstance);
        console.log(
          "Graph3D: Available methods:",
          Object.getOwnPropertyNames(graphInstance)
        );

        // Configure the graph with minimal settings to prevent errors
        graphInstance
          .backgroundColor("rgba(0,0,0,0)")
          .showNavInfo(false)
          .onNodeClick((node: { id: string }) => onNodeClick(node.id))
          .width(width)
          .height(height);

        graphRef.current = graphInstance;
        console.log("Graph3D: Graph configured successfully");

        // Set initial graph data immediately after initialization
        if (graph && graph.nodes && graph.nodes.length > 0) {
          const initialGraphData = {
            nodes: graph.nodes.map((node) => ({
              id: node.id,
              name: node.conversation.title,
              val: node.size || 5,
              color: node.color || "#4299e1",
              conversation: node.conversation,
            })),
            links: controls.showEdges
              ? graph.edges.map((edge) => ({
                  source: edge.source,
                  target: edge.target,
                  value: edge.weight || 1,
                }))
              : [],
          };
          console.log("Graph3D: Setting initial graph data", {
            nodeCount: initialGraphData.nodes.length,
            linkCount: initialGraphData.links.length,
            sampleNode: initialGraphData.nodes[0],
            sampleLink: initialGraphData.links[0]
          });
          
          try {
            (graphInstance as any).graphData(initialGraphData);
            console.log("Graph3D: Initial graph data set successfully");
            
            // Force a render after setting data
            setTimeout(() => {
              if (graphInstance) {
                try {
                  (graphInstance as any).zoomToFit(400, 30);
                  console.log("Graph3D: Initial zoom to fit completed");
                } catch (zoomError) {
                  console.warn("Graph3D: Initial zoom error:", zoomError);
                }
              }
            }, 100);
          } catch (dataError) {
            console.error("Graph3D: Error setting initial graph data:", dataError);
          }

          // Configure node and link properties immediately
          (graphInstance as any)
            .nodeLabel(
              (node: any) =>
                `<div class="p-2 rounded-md bg-gray-900 text-white border border-gray-700">${
                  node.name
                }<br/><span class="text-xs text-gray-400">${
                  node.conversation?.metadata?.messageCount || 0
                } messages</span></div>`
            )
            .nodeColor((node: any) => node.color)
            .nodeVal((node: any) => node.val)
            .linkWidth((edge: any) =>
              Math.max(edge.value * controls.edgeThickness, 1)
            )
            .linkColor(() => "rgba(0, 255, 136, 0.6)")
            .linkOpacity(0.8)
            .nodeThreeObject((node: any) => {
              const nodeData = node;
              const group = new THREE.Group();

              // Create the sphere
              const geometry = new THREE.SphereGeometry(
                nodeData.val || 5,
                16,
                8
              );
              const material = new THREE.MeshLambertMaterial({
                color: nodeData.color,
                transparent: true,
                opacity: 0.85,
              });
              const sphere = new THREE.Mesh(geometry, material);
              group.add(sphere);

              // Create the text sprite
              const title = nodeData.name || "Untitled";
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              if (context) {
                const fontSize = 14;
                context.font = `400 ${fontSize}px 'Inter', sans-serif`;

                const textWidth = context.measureText(title).width;
                const canvasWidth = Math.max(textWidth + 16, 40);
                const canvasHeight = fontSize + 8;

                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                // Draw bright green text
                context.font = `400 ${fontSize}px 'Inter', sans-serif`;
                context.fillStyle = "#00ff88";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(title, canvasWidth / 2, canvasHeight / 2);

                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;
                const spriteMaterial = new THREE.SpriteMaterial({
                  map: texture,
                  transparent: true,
                  alphaTest: 0.1,
                });
                const sprite = new THREE.Sprite(spriteMaterial);

                const aspectRatio = canvasWidth / canvasHeight;
                sprite.scale.set(10 * aspectRatio, 10, 1);
                sprite.position.y = (nodeData.val || 5) + 8;

                group.add(sprite);
              }

              return group;
            });
        }

        const handleResize = () => {
          if (containerRef.current && graphRef.current) {
            const newWidth = Math.max(containerRef.current.clientWidth, 800);
            const newHeight = Math.max(containerRef.current.clientHeight, 600);
            console.log("Graph3D: Resizing", { newWidth, newHeight });
            (graphRef.current as any).width(newWidth).height(newHeight);
          }
        };
        window.addEventListener("resize", handleResize);

        return true;
      } catch (error) {
        console.error("Graph3D: Failed to create graph instance", error);
        return false;
      }
    };

    // Try to initialize immediately
    if (!initializeGraph()) {
      // If immediate initialization fails, retry with delays
      const retryDelays = [100, 500, 1000, 2000];
      retryDelays.forEach((delay) => {
        setTimeout(() => {
          if (!graphRef.current) {
            initializeGraph();
          }
        }, delay);
      });
    }

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [ForceGraph3D, onNodeClick, graph, controls.showEdges, controls.edgeThickness]); // Added graph and controls dependencies for initial data setup

  // Update graph data when graph prop changes - SIMPLIFIED VERSION
  useEffect(() => {
    if (graphRef.current && graph && graph.nodes && graph.nodes.length > 0) {
      console.log("Graph3D: Updating graph data", {
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
      });

      const graphData = {
        nodes: graph.nodes.map((node) => ({
          id: node.id,
          name: node.conversation.title,
          val: node.size || 5,
          color: node.color || "#4299e1",
          conversation: node.conversation,
        })),
        links: controls.showEdges
          ? graph.edges.map((edge) => ({
              source: edge.source,
              target: edge.target,
              value: edge.weight || 1,
            }))
          : [],
      };

      try {
        // Simply set the graph data without complex simulation management
        (graphRef.current as any).graphData(graphData);
        
        // Update node colors for selection
        (graphRef.current as any).nodeColor((node: any) =>
          node.id === selectedNodeId ? "#FFD700" : node.color
        );

        // Center the graph after a short delay
        setTimeout(() => {
          if (graphRef.current) {
            try {
              (graphRef.current as any).zoomToFit(400, 30);
            } catch (zoomError) {
              console.warn("Graph3D: Error zooming to fit:", zoomError);
            }
          }
        }, 500);
      } catch (error) {
        console.error("Graph3D: Error updating graph data", error);
      }
    }
  }, [graph, controls.showEdges, controls.edgeThickness, selectedNodeId]);

  // Update selected node highlighting - SIMPLIFIED
  useEffect(() => {
    if (graphRef.current && selectedNodeId) {
      try {
        (graphRef.current as any).nodeColor((node: any) =>
          node.id === selectedNodeId ? "#FFD700" : node.color
        );
      } catch (error) {
        console.error("Graph3D: Error updating selected node", error);
      }
    }
  }, [selectedNodeId]);

  // Handle tab visibility changes and container resize
  useEffect(() => {
    if (graphRef.current && graph && graph.nodes.length > 0) {
      const handleResize = () => {
        if (containerRef.current && graphRef.current) {
          const container = containerRef.current;
          const newWidth = Math.max(
            container.clientWidth,
            container.offsetWidth,
            800
          );
          const newHeight = Math.max(
            container.clientHeight,
            container.offsetHeight,
            600
          );

          console.log("Graph3D: Resizing graph", { newWidth, newHeight });
          (graphRef.current as any).width(newWidth).height(newHeight);

          // Re-center the graph after resize
          setTimeout(() => {
            if (graphRef.current) {
              (graphRef.current as any).zoomToFit(400, 30);
            }
          }, 100);
        }
      };

      // Initial setup
      handleResize();

      // Set up resize observer for container changes
      const resizeObserver = new ResizeObserver(handleResize);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      // Set up window resize listener
      window.addEventListener("resize", handleResize);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [graph]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && graphRef.current && containerRef.current) {
        // Tab became visible, refresh the graph
        setTimeout(() => {
          if (graphRef.current && containerRef.current) {
            const container = containerRef.current;
            const newWidth = Math.max(
              container.clientWidth,
              container.offsetWidth,
              800
            );
            const newHeight = Math.max(
              container.clientHeight,
              container.offsetHeight,
              600
            );

            (graphRef.current as any).width(newWidth).height(newHeight);
            (graphRef.current as any).zoomToFit(400, 30);
          }
        }, 200);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading 3D visualization...</p>
        </div>
      </div>
    );
  }

  if (!ForceGraph3D) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">
            Failed to load 3D visualization library
          </p>
        </div>
      </div>
    );
  }

  // Show message if no data
  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <BrainCircuit className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            No conversation data to visualize
          </p>
          <p className="text-muted-foreground text-sm">
            Upload your ChatGPT export to see the neural map
          </p>
          <button
            onClick={() => {
              // Test with dummy data
              const testData = {
                nodes: [
                  {
                    id: "test1",
                    name: "Test Node 1",
                    val: 10,
                    color: "#ff0000",
                  },
                  {
                    id: "test2",
                    name: "Test Node 2",
                    val: 15,
                    color: "#00ff00",
                  },
                  {
                    id: "test3",
                    name: "Test Node 3",
                    val: 8,
                    color: "#0000ff",
                  },
                ],
                links: [
                  { source: "test1", target: "test2", value: 1 },
                  { source: "test2", target: "test3", value: 1 },
                ],
              };
              if (graphRef.current) {
                console.log("Testing with dummy data");
                (graphRef.current as any).graphData(testData);
              }
            }}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Test 3D Visualization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        position: "relative",
      }}
    >
      {/* Focus button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => {
            if (graphRef.current) {
              console.log("Focus button clicked - centering graph");
              // Multiple attempts to ensure proper focusing
              (graphRef.current as any).zoomToFit(400, 20);
              setTimeout(() => (graphRef.current as any)?.zoomToFit(400, 20), 100);
              setTimeout(() => (graphRef.current as any)?.zoomToFit(400, 20), 500);
            }
          }}
          className="px-4 py-2 bg-blue-600/90 hover:bg-blue-600 text-white text-sm rounded-md backdrop-blur-sm border border-blue-500/30 transition-colors shadow-lg"
          title="Center and focus the graph"
        >
          🎯 Focus Graph
        </button>
      </div>
    </div>
  );
};

// Memoize the component to prevent re-renders when parent state changes unnecessarily
export const Graph3D = memo(Graph3DComponent);
