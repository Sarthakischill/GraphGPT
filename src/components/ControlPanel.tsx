'use client'

import { ConversationGraph, VisualizationControls } from '@/types'
import { Sliders, Palette, Maximize2, Eye, EyeOff, Component } from 'lucide-react'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface ControlPanelProps {
  controls: VisualizationControls
  onControlsChange: (controls: VisualizationControls) => void
  graph: ConversationGraph
}

export function ControlPanel({ controls, onControlsChange, graph }: ControlPanelProps) {
  const updateControl = <K extends keyof VisualizationControls>(
    key: K,
    value: VisualizationControls[K]
  ) => {
    onControlsChange({ ...controls, [key]: value })
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="space-y-8">
        {/* Similarity Threshold */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base">
            <Sliders className="w-4 h-4 text-primary" />
            Similarity Threshold
          </Label>
          <div className="space-y-2">
            <Slider
              min={0.1}
              max={0.95}
              step={0.05}
              value={[controls.similarityThreshold]}
              onValueChange={(value) => updateControl('similarityThreshold', value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Less Similar</span>
              <span className="font-medium text-foreground">
                {controls.similarityThreshold.toFixed(2)}
              </span>
              <span>More Similar</span>
            </div>
          </div>
        </div>

        {/* Node Size */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base">
            <Maximize2 className="w-4 h-4 text-primary" />
            Node Size
          </Label>
          <Select
            value={controls.nodeSize}
            onValueChange={(value: VisualizationControls['nodeSize']) => updateControl('nodeSize', value)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="messageCount">Message Count</SelectItem>
              <SelectItem value="wordCount">Word Count</SelectItem>
              <SelectItem value="uniform">Uniform Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Scheme */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base">
            <Palette className="w-4 h-4 text-primary" />
            Color Scheme
          </Label>
          <Select
            value={controls.colorScheme}
            onValueChange={(value: VisualizationControls['colorScheme']) => updateControl('colorScheme', value)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cluster">By Cluster</SelectItem>
              <SelectItem value="chronological">By Date</SelectItem>
              <SelectItem value="topic">By Topic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clustering Algorithm */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base">
            <Component className="w-4 h-4 text-primary" />
            Clustering Algorithm
          </Label>
          <Select
            value={controls.clusteringAlgorithm}
            onValueChange={(value: VisualizationControls['clusteringAlgorithm']) => updateControl('clusteringAlgorithm', value)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="similarity">Similarity Based</SelectItem>
              <SelectItem value="topic">Topic Based</SelectItem>
              <SelectItem value="chronological">Chronological</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Edge Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-edges" className="flex items-center gap-2 text-base">
              {controls.showEdges ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}
              Show Connections
            </Label>
            <Switch
              id="show-edges"
              checked={controls.showEdges}
              onCheckedChange={(checked) => updateControl('showEdges', checked)}
            />
          </div>
            
          {controls.showEdges && (
            <div className="space-y-3">
              <Label>Edge Thickness</Label>
              <Slider
                min={0.5} max={5} step={0.1}
                value={[controls.edgeThickness]}
                onValueChange={(value) => updateControl('edgeThickness', value[0])}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Thin</span>
                <span className="font-medium text-foreground">{controls.edgeThickness.toFixed(1)}</span>
                <span>Thick</span>
              </div>
            </div>
          )}
        </div>

        {/* Graph Statistics */}
        <Card>
          <CardHeader><CardTitle>Graph Statistics</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Conversations:</span><span>{graph.nodes.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Clusters:</span><span>{graph.clusters.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Connections:</span><span>{graph.edges.length}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}