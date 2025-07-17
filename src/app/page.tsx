'use client'

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { GraphDataContext } from '@/context/GraphDataContext';
import { Loader2, ArrowRight, BrainCircuit, Network, Eye, Upload, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

export default function HomePage() {
  const { processAndSetGraphData, isLoading, progress, error } = useContext(GraphDataContext);
  const router = useRouter();

  const handleFileSelect = async (file: File) => {
    const success = await processAndSetGraphData(file);
    if (success) {
      router.push('/dashboard');
    }
  };

  const handleTryDemo = () => {
    const demoData = {
      conversations: [
        {
          id: "demo-1",
          title: "JavaScript Best Practices",
          create_time: Date.now() / 1000 - 86400,
          update_time: Date.now() / 1000 - 86400,
          current_node: "node-2",
          moderation_results: [],
          mapping: {
            "node-1": {
              id: "node-1",
              message: {
                id: "msg-1",
                author: { role: "user" },
                content: {
                  content_type: "text",
                  parts: ["What are some JavaScript best practices for writing clean code?"]
                },
                create_time: Date.now() / 1000 - 86400
              },
              parent: null,
              children: ["node-2"]
            },
            "node-2": {
              id: "node-2",
              message: {
                id: "msg-2",
                author: { role: "assistant" },
                content: {
                  content_type: "text",
                  parts: ["Here are some key JavaScript best practices: 1. Use meaningful variable names, 2. Keep functions small and focused, 3. Use const and let instead of var, 4. Handle errors properly with try-catch blocks, 5. Use modern ES6+ features like arrow functions and destructuring."]
                },
                create_time: Date.now() / 1000 - 86400 + 30
              },
              parent: "node-1",
              children: []
            }
          }
        },
        {
          id: "demo-2",
          title: "React Hooks Explained",
          create_time: Date.now() / 1000 - 172800,
          update_time: Date.now() / 1000 - 172800,
          current_node: "node-4",
          moderation_results: [],
          mapping: {
            "node-3": {
              id: "node-3",
              message: {
                id: "msg-3",
                author: { role: "user" },
                content: {
                  content_type: "text",
                  parts: ["Can you explain React hooks and when to use useState vs useEffect?"]
                },
                create_time: Date.now() / 1000 - 172800
              },
              parent: null,
              children: ["node-4"]
            },
            "node-4": {
              id: "node-4",
              message: {
                id: "msg-4",
                author: { role: "assistant" },
                content: {
                  content_type: "text",
                  parts: ["React hooks are functions that let you use state and lifecycle features in functional components. useState is for managing component state - use it when you need to store and update values that affect rendering. useEffect is for side effects like API calls, subscriptions, or DOM manipulation - use it when you need to perform actions after render or cleanup."]
                },
                create_time: Date.now() / 1000 - 172800 + 45
              },
              parent: "node-3",
              children: []
            }
          }
        },
        {
          id: "demo-3",
          title: "CSS Grid vs Flexbox",
          create_time: Date.now() / 1000 - 259200,
          update_time: Date.now() / 1000 - 259200,
          current_node: "node-6",
          moderation_results: [],
          mapping: {
            "node-5": {
              id: "node-5",
              message: {
                id: "msg-5",
                author: { role: "user" },
                content: {
                  content_type: "text",
                  parts: ["When should I use CSS Grid vs Flexbox for layouts?"]
                },
                create_time: Date.now() / 1000 - 259200
              },
              parent: null,
              children: ["node-6"]
            },
            "node-6": {
              id: "node-6",
              message: {
                id: "msg-6",
                author: { role: "assistant" },
                content: {
                  content_type: "text",
                  parts: ["Use CSS Grid for two-dimensional layouts where you need precise control over both rows and columns. It's perfect for page layouts, card grids, and complex designs. Use Flexbox for one-dimensional layouts - either horizontal or vertical alignment. It's great for navigation bars, centering content, and distributing space between items."]
                },
                create_time: Date.now() / 1000 - 259200 + 60
              },
              parent: "node-5",
              children: []
            }
          }
        }
      ]
    };

    const testBlob = new Blob([JSON.stringify(demoData)], { type: 'application/json' });
    const testFile = new File([testBlob], "demo-conversations.json", { type: "application/json" });
    handleFileSelect(testFile);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <BrainCircuit className="w-12 h-12 text-foreground animate-pulse" />
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-medium">
              Processing Your Conversations
            </h2>
            {progress && (
              <div className="space-y-3">
                <Progress value={progress.progress} className="w-full h-1" />
                <p className="text-muted-foreground text-sm">{progress.message}</p>
                <Badge variant="secondary" className="glass">
                  {Math.round(progress.progress)}%
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-6 h-6" />
              <span className="font-medium">Neural Visualizer</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Models
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Solutions
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Contact sales
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </button>
              <button className="btn-minimal">
                Start for Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden dot-pattern">
        <div className="container mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight">
                The fastest, ultra-realistic
                <br />
                <span className="text-muted-foreground">conversation AI platform</span>
              </h1>
              
              <div className="space-y-2 max-w-2xl mx-auto">
                <p className="text-lg text-muted-foreground">
                  Powered by high performance State Space Model technology.
                </p>
                <p className="text-lg text-muted-foreground">
                  Purpose-built for developers.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button 
                onClick={handleTryDemo}
                className="btn-minimal"
              >
                Start for free
              </button>
              
              <button 
                onClick={() => router.push('/upload')}
                className="btn-minimal-outline"
              >
                Read the docs
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            Explore Your Conversations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI analysis reveals hidden patterns in your ChatGPT history
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Network,
              title: "3D Neural Network",
              description: "Visualize conversations as interconnected nodes in 3D space",
              delay: 0.1
            },
            {
              icon: Eye,
              title: "Smart Insights",
              description: "Discover patterns and trends in your conversation history",
              delay: 0.2
            },
            {
              icon: Sparkles,
              title: "Interactive Controls",
              description: "Customize visualization to focus on what matters",
              delay: 0.3
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
            >
              <Card className="glass card-hover h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-lg bg-accent/30 w-fit">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Card className="glass max-w-2xl mx-auto">
            <CardHeader className="py-12">
              <BrainCircuit className="w-10 h-10 mx-auto mb-6" />
              <CardTitle className="text-2xl md:text-3xl font-medium mb-4">
                Ready to Explore?
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mb-8">
                Upload your ChatGPT export and discover the neural landscape of your conversations
              </CardDescription>
              <Button 
                onClick={() => router.push('/upload')}
                className="btn-minimal"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}