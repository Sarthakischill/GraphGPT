'use client'

import { useEffect, useRef } from 'react'
import { ConversationGraph, VisualizationControls } from '@/types'

interface Graph2DProps {
  graph: ConversationGraph
  controls: VisualizationControls
  onNodeClick: (nodeId: string) => void
  selectedNodeId: string | null
}

export function Graph2D({ graph, controls, onNodeClick, selectedNodeId }: Graph2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Calculate positions for nodes in a circle
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(rect.width, rect.height) * 0.3

    // Draw edges first (behind nodes)
    if (controls.showEdges) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1

      graph.edges.forEach(edge => {
        const sourceIndex = graph.nodes.findIndex(n => n.id === edge.source)
        const targetIndex = graph.nodes.findIndex(n => n.id === edge.target)
        
        if (sourceIndex === -1 || targetIndex === -1) return

        const sourceAngle = (sourceIndex / graph.nodes.length) * 2 * Math.PI
        const targetAngle = (targetIndex / graph.nodes.length) * 2 * Math.PI

        const sourceX = centerX + Math.cos(sourceAngle) * radius
        const sourceY = centerY + Math.sin(sourceAngle) * radius
        const targetX = centerX + Math.cos(targetAngle) * radius
        const targetY = centerY + Math.sin(targetAngle) * radius

        ctx.beginPath()
        ctx.moveTo(sourceX, sourceY)
        ctx.lineTo(targetX, targetY)
        ctx.stroke()
      })
    }

    // Draw nodes
    graph.nodes.forEach((node, index) => {
      const angle = (index / graph.nodes.length) * 2 * Math.PI
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Node circle
      ctx.beginPath()
      ctx.arc(x, y, node.size, 0, 2 * Math.PI)
      ctx.fillStyle = selectedNodeId === node.id ? '#FFD700' : node.color
      ctx.fill()

      // Node border
      ctx.strokeStyle = selectedNodeId === node.id ? '#FFA500' : 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Node label
      ctx.fillStyle = 'white'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        node.conversation.title.substring(0, 20) + (node.conversation.title.length > 20 ? '...' : ''),
        x,
        y + node.size + 15
      )
    })

    // Add click handler
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const clickY = event.clientY - rect.top

      graph.nodes.forEach((node, index) => {
        const angle = (index / graph.nodes.length) * 2 * Math.PI
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2)
        if (distance <= node.size) {
          onNodeClick(node.id)
        }
      })
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('click', handleClick)
    }
  }, [graph, controls, onNodeClick, selectedNodeId])

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ minHeight: '600px' }}
      />
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
        2D Network View - Click nodes to explore
      </div>
    </div>
  )
}