"use client";

import { useEffect, useRef, useState, memo } from "react";
import { ConversationGraph, VisualizationControls } from "@/types";
import { BrainCircuit } from "lucide-react";
import * as THREE from "three";

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
  const graphRef = useRef<any>(null); // To hold the graph instance
  const [isLoading, setIsLoading] = useState(true);
  const [ForceGraph3D, setForceGraph3D] = useState<any>(null);

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
        const module = await import("3d-force-graph");
        setForceGraph3D(() => module.default);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load 3D force graph:", error);
        setIsLoading(false);
      }
    };
    loadForceGraph();
  }, []);

  // Initialize graph with retry logic and WebGL detection
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
        const graphInstance = ForceGraph3D()(container);

        console.log("Graph3D: ForceGraph3D instance created:", graphInstance);
        console.log(
          "Graph3D: Available methods:",
          Object.getOwnPropertyNames(graphInstance)
        );

        // Configure the graph
        graphInstance
          .backgroundColor("rgba(0,0,0,0)")
          .showNavInfo(false)
          .onNodeClick((node: any) => onNodeClick(node.id as string))
          .width(width)
          .height(height);

        graphRef.current = graphInstance;
        console.log("Graph3D: Graph configured successfully");

        // Immediately check what's in the container
        console.log("Graph3D: Container after creation:", {
          children: container.children.length,
          innerHTML: container.innerHTML.substring(0, 200),
          hasCanvas: !!container.querySelector("canvas"),
        });

        // Try to force render immediately
        if (graphInstance.refresh) {
          console.log("Graph3D: Calling refresh()");
          graphInstance.refresh();
        }

        // Check again after a delay
        setTimeout(() => {
          const canvas = container.querySelector("canvas");
          console.log("Canvas check after delay:", {
            canvasFound: !!canvas,
            canvasWidth: canvas?.width,
            canvasHeight: canvas?.height,
            containerChildren: container.children.length,
            containerHTML: container.innerHTML.substring(0, 200),
          });

          // Try different methods to force rendering
          if (!canvas && graphRef.current) {
            console.log("No canvas found, trying different approaches");

            // Try setting some test data to trigger rendering
            const testData = {
              nodes: [{ id: "test", name: "Test", val: 10, color: "#ff0000" }],
              links: [],
            };

            console.log("Setting test data to trigger rendering");
            graphRef.current.graphData(testData);

            // Try accessing the renderer directly
            console.log("Checking renderer:", {
              hasRenderer: !!graphRef.current.renderer,
              hasScene: !!graphRef.current.scene,
              hasCamera: !!graphRef.current.camera,
            });

            // Try to get the renderer's DOM element
            if (graphRef.current.renderer && graphRef.current.renderer()) {
              const renderer = graphRef.current.renderer();
              console.log("Renderer found:", renderer);
              if (renderer.domElement) {
                console.log("Renderer DOM element found:", renderer.domElement);
                container.appendChild(renderer.domElement);
                console.log("Manually appended renderer DOM element");
              }
            }

            // Try other methods
            if (graphRef.current.refresh) graphRef.current.refresh();
            if (graphRef.current.resumeAnimation)
              graphRef.current.resumeAnimation();
            if (graphRef.current.zoomToFit) graphRef.current.zoomToFit(1000);
          }
        }, 500);

        const handleResize = () => {
          if (containerRef.current && graphRef.current) {
            const newWidth = Math.max(containerRef.current.clientWidth, 800);
            const newHeight = Math.max(containerRef.current.clientHeight, 600);
            console.log("Graph3D: Resizing", { newWidth, newHeight });
            graphRef.current.width(newWidth).height(newHeight);
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
  }, [ForceGraph3D, onNodeClick]);

  // Update graph data when it changes
  useEffect(() => {
    if (graphRef.current) {
      const graphData = {
        nodes: graph.nodes.map((node) => ({
          id: node.id,
          name: node.conversation.title,
          val: node.size || 5, // Ensure nodes have a size
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

      console.log("Graph3D: Setting graph data", {
        nodeCount: graphData.nodes.length,
        linkCount: graphData.links.length,
        sampleNode: graphData.nodes[0],
        containerDimensions: containerRef.current
          ? {
              width: containerRef.current.clientWidth,
              height: containerRef.current.clientHeight,
            }
          : null,
      });

      // Set the graph data
      graphRef.current.graphData(graphData);

      // Additional configuration to ensure visibility
      graphRef.current
        .nodeAutoColorBy("color")
        .enableNodeDrag(true)
        .enableNavigationControls(true);

      // Apply aggressive centering with multiple attempts for reliability
      const centerGraph = () => {
        if (graphRef.current) {
          console.log("Graph3D: Centering graph with zoomToFit");
          graphRef.current.zoomToFit(400, 30);
        }
      };

      // Multiple centering attempts to ensure it works on initial load
      setTimeout(centerGraph, 50);   // Very quick
      setTimeout(centerGraph, 200);  // Quick
      setTimeout(centerGraph, 500);  // Medium
      setTimeout(centerGraph, 1000); // Fallback
      setTimeout(centerGraph, 2000); // Final fallback

      console.log("Graph3D: Applied graph data and scheduled aggressive centering");
    }
  }, [graph, controls.showEdges]);

  // Update other properties when controls change
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current
        .nodeLabel(
          (node: any) =>
            `<div class="p-2 rounded-md bg-gray-900 text-white border border-gray-700">${
              node.name
            }<br/><span class="text-xs text-gray-400">${
              node.conversation?.metadata?.messageCount || 0
            } messages</span></div>`
        )
        .nodeColor((node: any) =>
          node.id === selectedNodeId ? "#FFD700" : node.color
        )
        .nodeVal((node: any) => node.val)
        .linkWidth((edge: any) =>
          Math.max(edge.value * controls.edgeThickness, 1)
        ) // Ensure minimum width
        .linkColor(() => "rgba(0, 255, 136, 0.6)") // Green connections like in reference
        .linkOpacity(0.8) // More visible
        // Create combined sphere + text nodes using Three.js Groups
        .nodeThreeObject((node: any) => {
          const nodeData = node;
          const group = new THREE.Group();

          // 1. CREATE THE SPHERE (THE NODE ITSELF)
          const geometry = new THREE.SphereGeometry(nodeData.val || 5, 16, 8);
          const material = new THREE.MeshLambertMaterial({
            color: nodeData.color,
            transparent: true,
            opacity: 0.85,
          });
          const sphere = new THREE.Mesh(geometry, material);
          group.add(sphere);

          // 2. CREATE THE GREEN TEXT SPRITE (like in the reference image)
          const title = nodeData.name || "Untitled";
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (context) {
            const fontSize = 12; // Clean, readable size
            context.font = `400 ${fontSize}px 'Montserrat', sans-serif`; // Regular weight

            const textWidth = context.measureText(title).width;
            const canvasWidth = Math.max(textWidth + 12, 30); // Minimal padding
            const canvasHeight = fontSize + 6;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Draw sharp green text (no background, clean and bright)
            context.font = `400 ${fontSize}px 'Montserrat', sans-serif`;
            context.fillStyle = "#00ff88"; // Bright green
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

            // Scale and position the sprite
            const aspectRatio = canvasWidth / canvasHeight;
            sprite.scale.set(8 * aspectRatio, 8, 1); // Smaller scale
            sprite.position.y = (nodeData.val || 5) + 6; // Position above the sphere

            group.add(sprite);
          }

          return group;
        });

      // Re-heat simulation to apply new color to selected node
      graphRef.current.d3ReheatSimulation();
    }
  }, [controls, selectedNodeId]);

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
                graphRef.current.graphData(testData);
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
              graphRef.current.zoomToFit(800, 50);
            }
          }}
          className="px-3 py-2 bg-primary/80 hover:bg-primary text-primary-foreground text-sm rounded-md backdrop-blur-sm border border-primary/20 transition-colors"
          title="Center and focus the graph"
        >
          🎯 Focus
        </button>
      </div>
    </div>
  );
};

// Memoize the component to prevent re-renders when parent state changes unnecessarily
export const Graph3D = memo(Graph3DComponent);
