'use client'

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { GraphDataContext } from '@/context/GraphDataContext';
import { Loader2, ArrowRight, Zap, BrainCircuit, Network, Eye, Upload, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/95">
        <div className="w-full max-w-md space-y-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <BrainCircuit className="w-16 h-16 text-primary pulse-glow" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-primary/30 rounded-full animate-ping" />
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold gradient-text">
              Processing Your Neural Universe
            </h2>
            {progress && (
              <div className="space-y-3">
                <Progress value={progress.progress} className="w-full h-2" />
                <p className="text-muted-foreground text-sm">{progress.message}</p>
                <Badge variant="secondary" className="glass">
                  {Math.round(progress.progress)}% Complete
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary/60 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse delay-2000" />
          <div className="neural-line absolute top-1/2 left-0 w-full" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <Badge variant="secondary" className="glass px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Conversation Analysis
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Visualize Your
                <span className="block gradient-text">ChatGPT History</span>
                <span className="block text-muted-foreground text-2xl md:text-3xl lg:text-4xl font-normal mt-2">
                  in 3D Neural Space
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your conversations into an interactive neural network. 
                Discover patterns, explore connections, and visualize your intellectual journey.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                onClick={handleTryDemo}
                size="lg" 
                className="btn-hover shadow-neural group px-8 py-6 text-lg"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Try Interactive Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/upload')}
                className="btn-hover glass px-8 py-6 text-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your Data
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Your Mind Like Never Before
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered analysis reveals hidden patterns in your ChatGPT conversations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Network,
              title: "3D Neural Network",
              description: "See your conversations as interconnected nodes in beautiful 3D space",
              details: "Each conversation becomes a node, with connections showing semantic similarity. Rotate, zoom, and explore your knowledge graph intuitively.",
              delay: 0.1
            },
            {
              icon: Eye,
              title: "Smart Insights",
              description: "Discover patterns and trends in your conversation history",
              details: "AI-powered analysis reveals topic clusters, conversation evolution, and knowledge domains you explore most frequently.",
              delay: 0.2
            },
            {
              icon: Zap,
              title: "Interactive Controls",
              description: "Customize the visualization to focus on what matters to you",
              details: "Adjust similarity thresholds, filter by date ranges, and customize the appearance to explore different perspectives.",
              delay: 0.3
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
            >
              <Card className="h-full glass card-hover group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.details}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Card className="glass max-w-2xl mx-auto">
            <CardHeader>
              <BrainCircuit className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl md:text-3xl">
                Ready to Explore Your Mind?
              </CardTitle>
              <CardDescription className="text-lg">
                Upload your ChatGPT export and start your journey into the neural landscape of your conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => router.push('/upload')}
                size="lg" 
                className="btn-hover shadow-neural-lg w-full sm:w-auto px-12 py-6 text-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}