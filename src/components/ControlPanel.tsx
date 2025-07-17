'use client'

import { ConversationGraph, VisualizationControls } from '@/types'
import { Sliders, Palette, Maximize2, Eye, EyeOff, Component, Activity, TrendingUp } from 'lucide-react'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { motion } from 'motion/react'

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
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <div className="p-1 rounded bg-accent/30">
              <Sliders className="w-4 h-4" />
            </div>
            Similarity Threshold
          </Label>
          <div className="space-y-3">
            <Slider
              min={0.1}
              max={0.95}
              step={0.05}
              value={[controls.similarityThreshold]}
              onValueChange={(value) => updateControl('similarityThreshold', value[0])}
              className="transition-smooth"
            />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Less Similar</span>
              <Badge variant="secondary" className="glass">
                {controls.similarityThreshold.toFixed(2)}
              </Badge>
              <span className="text-muted-foreground">More Similar</span>
            </div>
          </div>
        </motion.div>

        {/* Node Size */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <div className="p-1 rounded bg-accent/30">
              <Maximize2 className="w-4 h-4" />
            </div>
            Node Size
          </Label>
          <Select
            value={controls.nodeSize}
            onValueChange={(value: VisualizationControls['nodeSize']) => updateControl('nodeSize', value)}
          >
            <SelectTrigger className="glass focus-ring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="messageCount">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Message Count
                </div>
              </SelectItem>
              <SelectItem value="wordCount">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Word Count
                </div>
              </SelectItem>
              <SelectItem value="uniform">
                <div className="flex items-center gap-2">
                  <Component className="w-4 h-4" />
                  Uniform Size
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Color Scheme */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <div className="p-1 rounded bg-accent/30">
              <Palette className="w-4 h-4" />
            </div>
            Color Scheme
          </Label>
          <Select
            value={controls.colorScheme}
            onValueChange={(value: VisualizationControls['colorScheme']) => updateControl('colorScheme', value)}
          >
            <SelectTrigger className="glass focus-ring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="cluster">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-foreground" />
                  By Cluster
                </div>
              </SelectItem>
              <SelectItem value="chronological">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-muted-foreground to-foreground" />
                  By Date
                </div>
              </SelectItem>
              <SelectItem value="topic">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-muted to-foreground" />
                  By Topic
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Clustering Algorithm */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <div className="p-1 rounded bg-accent/30">
              <Component className="w-4 h-4" />
            </div>
            Clustering Algorithm
          </Label>
          <Select
            value={controls.clusteringAlgorithm}
            onValueChange={(value: VisualizationControls['clusteringAlgorithm']) => updateControl('clusteringAlgorithm', value)}
          >
            <SelectTrigger className="glass focus-ring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="similarity">Similarity Based</SelectItem>
              <SelectItem value="topic">Topic Based</SelectItem>
              <SelectItem value="chronological">Chronological</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Edge Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="show-edges" className="flex items-center gap-2 text-sm font-medium">
              <div className="p-1 rounded bg-accent/30">
                {controls.showEdges ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </div>
              Show Connections
            </Label>
            <Switch
              id="show-edges"
              checked={controls.showEdges}
              onCheckedChange={(checked) => updateControl('showEdges', checked)}
              className="focus-ring"
            />
          </div>
            
          {controls.showEdges && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <Label className="text-sm font-medium text-muted-foreground">Edge Thickness</Label>
              <Slider
                min={0.5} max={5} step={0.1}
                value={[controls.edgeThickness]}
                onValueChange={(value) => updateControl('edgeThickness', value[0])}
                className="transition-smooth"
              />
              
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Thin</span>
                <Badge variant="secondary" className="glass">
                  {controls.edgeThickness.toFixed(1)}
                </Badge>
                <span className="text-muted-foreground">Thick</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Graph Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <div className="p-1 rounded bg-accent/30">
                  <Activity className="w-4 h-4" />
                </div>
                Network Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-accent/20 border border-border/50">
                  <div className="text-xl font-medium">{graph.nodes.length}</div>
                  <div className="text-xs text-muted-foreground">Conversations</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/20 border border-border/50">
                  <div className="text-xl font-medium">{graph.clusters.length}</div>
                  <div className="text-xs text-muted-foreground">Clusters</div>
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/20 border border-border/50">
                <div className="text-xl font-medium">{graph.edges.length}</div>
                <div className="text-xs text-muted-foreground">Active Connections</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}