// chat-history-visualizer/src/components/Graph3DClient.tsx
"use client";

import { useEffect, useRef, memo } from "react";
import ForceGraph3D, { ForceGraph3DInstance, LinkObject, NodeObject } from "3d-force-graph";
import { ConversationGraph, VisualizationControls } from "@/types";
import { BrainCircuit } from "lucide-react";
import * as THREE from "three";

// Extend the NodeObject to include our custom data
interface CustomNodeObject extends NodeObject {
  name: string;
  val: number;
  color: string;
  conversation?: {
    metadata?: {
      messageCount?: number;
    };
  };
}

interface CustomLinkObject extends LinkObject {
  value: number;
}

interface GraphData {
  nodes: CustomNodeObject[];
  links: CustomLinkObject[];
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
  const graphRef = useRef<ForceGraph3DInstance | null>(null);

  // Initialize graph with retry logic and WebGL detection, and set initial data
  useEffect(() => {
    if (graphRef.current) return;

    // Check WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return !!gl;
      } catch {
        return false;
      }
    };

    const webglSupported = checkWebGL();
    if (!webglSupported) {
      return;
    }

    const initializeGraph = () => {
      const container = containerRef.current;
      if (!container) return false;

      container.innerHTML = "";

      const width = Math.max(container.clientWidth, container.offsetWidth, 800);
      const height = Math.max(
        container.clientHeight,
        container.offsetHeight,
        600
      );

      try {
        const graphInstance = new ForceGraph3D(container)
          .backgroundColor("rgba(0,0,0,0)")
          .showNavInfo(false)
          .onNodeClick((node) => onNodeClick(node.id as string))
          .width(width)
          .height(height);

        graphRef.current = graphInstance;

        if (graph && graph.nodes && graph.nodes.length > 0) {
          const initialGraphData: GraphData = {
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
          graphInstance.graphData(initialGraphData);

          setTimeout(() => {
            if (graphInstance) {
              graphInstance.zoomToFit(400, 30);
            }
          }, 100);

          graphInstance
            .nodeLabel(
              (node: NodeObject) => {
                const customNode = node as CustomNodeObject;
                return `<div class="p-2 rounded-md bg-gray-900 text-white border border-gray-700">${
                  customNode.name
                }<br/><span class="text-xs text-gray-400">${
                  customNode.conversation?.metadata?.messageCount || 0
                } messages</span></div>`
              }
            )
            .nodeColor((node: NodeObject) => (node as CustomNodeObject).color)
            .nodeVal((node: NodeObject) => (node as CustomNodeObject).val)
            .linkWidth((edge: LinkObject) =>
              Math.max((edge as CustomLinkObject).value * controls.edgeThickness, 1)
            )
            .linkColor(() => "rgba(0, 255, 136, 0.6)")
            .linkOpacity(0.8)
            .nodeThreeObject((node: NodeObject) => {
              const nodeData = node as CustomNodeObject;
              const group = new THREE.Group();

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
            graphRef.current.width(newWidth).height(newHeight);
          }
        };
        window.addEventListener("resize", handleResize);

        return true;
      } catch {
        return false;
      }
    };

    if (!initializeGraph()) {
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
  }, [controls.edgeThickness, controls.showEdges, graph, onNodeClick]);

  useEffect(() => {
    if (graphRef.current && graph && graph.nodes && graph.nodes.length > 0) {
      const graphData: GraphData = {
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

      graphRef.current.graphData(graphData);

      graphRef.current.nodeColor((node: NodeObject) => {
        const customNode = node as CustomNodeObject;
        return customNode.id === selectedNodeId ? "#FFD700" : customNode.color
      });

      setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.zoomToFit(400, 30);
        }
      }, 500);
    }
  }, [graph, controls.showEdges, controls.edgeThickness, selectedNodeId]);

  useEffect(() => {
    if (graphRef.current && selectedNodeId) {
      graphRef.current.nodeColor((node: NodeObject) => {
        const customNode = node as CustomNodeObject;
        return customNode.id === selectedNodeId ? "#FFD700" : customNode.color
      });
    }
  }, [selectedNodeId]);

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

          graphRef.current.width(newWidth).height(newHeight);

          setTimeout(() => {
            if (graphRef.current) {
              graphRef.current.zoomToFit(400, 30);
            }
          }, 100);
        }
      };

      handleResize();

      const resizeObserver = new ResizeObserver(handleResize);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      window.addEventListener("resize", handleResize);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [graph]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && graphRef.current && containerRef.current) {
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

            graphRef.current.width(newWidth).height(newHeight);
            graphRef.current.zoomToFit(400, 30);
          }
        }, 200);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <BrainCircuit className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            No conversation data to visualize
          </p>
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
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => {
            if (graphRef.current) {
              graphRef.current.zoomToFit(400, 20);
              setTimeout(() => graphRef.current?.zoomToFit(400, 20), 100);
              setTimeout(() => graphRef.current?.zoomToFit(400, 20), 500);
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

export const Graph3D = memo(Graph3DComponent);
