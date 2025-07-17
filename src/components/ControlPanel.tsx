"use client";

import { ConversationGraph, VisualizationControls } from "@/types";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Settings, Eye, Palette, Scale } from "lucide-react";

interface ControlPanelProps {
  controls: VisualizationControls;
  onControlsChange: (controls: VisualizationControls) => void;
  graph: ConversationGraph;
}

export function ControlPanel({
  controls,
  onControlsChange,
  graph,
}: ControlPanelProps) {
  const updateControl = (key: keyof VisualizationControls, value: string | number | boolean) => {
    onControlsChange({
      ...controls,
      [key]: value,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Similarity Threshold */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Eye className="w-4 h-4" />
            Similarity Threshold
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Connection sensitivity
            </Label>
            <Badge variant="outline" className="text-xs">
              {Math.round(controls.similarityThreshold * 100)}%
            </Badge>
          </div>
          <Slider
            value={[controls.similarityThreshold]}
            onValueChange={([value]) =>
              updateControl("similarityThreshold", value)
            }
            min={0.1}
            max={1.0}
            step={0.05}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Node Size */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Scale className="w-4 h-4" />
            Node Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={controls.nodeSize}
            onValueChange={(value) => updateControl("nodeSize", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="messageCount">Message Count</SelectItem>
              <SelectItem value="wordCount">Word Count</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Palette className="w-4 h-4" />
            Color Scheme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={controls.colorScheme}
            onValueChange={(value) => updateControl("colorScheme", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cluster">By Cluster</SelectItem>
              <SelectItem value="chronological">By Date</SelectItem>
              <SelectItem value="topic">By Topic</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Edge Controls */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Settings className="w-4 h-4" />
            Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show connections</Label>
            <Switch
              checked={controls.showEdges}
              onCheckedChange={(checked) => updateControl("showEdges", checked)}
            />
          </div>

          {controls.showEdges && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Line thickness
                </Label>
                <Badge variant="outline" className="text-xs">
                  {controls.edgeThickness}x
                </Badge>
              </div>
              <Slider
                value={[controls.edgeThickness]}
                onValueChange={([value]) =>
                  updateControl("edgeThickness", value)
                }
                min={0.5}
                max={3.0}
                step={0.5}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Graph Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Nodes:</span>
            <span>{graph.nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Connections:</span>
            <span>{graph.edges.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Clusters:</span>
            <span>{graph.clusters.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
