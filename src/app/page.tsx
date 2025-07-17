'use client'

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { GraphDataContext } from '@/context/GraphDataContext';
import { BrainCircuit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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

  const handleTryDemo = async () => {
    console.log('Demo button clicked');
    
    const demoData = [
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
      },
      {
        id: "demo-4",
        title: "Python Data Analysis",
        create_time: Date.now() / 1000 - 345600,
        update_time: Date.now() / 1000 - 345600,
        current_node: "node-8",
        moderation_results: [],
        mapping: {
          "node-7": {
            id: "node-7",
            message: {
              id: "msg-7",
              author: { role: "user" },
              content: {
                content_type: "text",
                parts: ["How do I get started with data analysis in Python?"]
              },
              create_time: Date.now() / 1000 - 345600
            },
            parent: null,
            children: ["node-8"]
          },
          "node-8": {
            id: "node-8",
            message: {
              id: "msg-8",
              author: { role: "assistant" },
              content: {
                content_type: "text",
                parts: ["To get started with data analysis in Python, you'll want to learn these key libraries: 1. Pandas for data manipulation and analysis, 2. NumPy for numerical computing, 3. Matplotlib and Seaborn for data visualization, 4. Jupyter notebooks for interactive development. Start with loading CSV files using pandas.read_csv() and explore basic operations like filtering, grouping, and aggregating data."]
              },
              create_time: Date.now() / 1000 - 345600 + 50
            },
            parent: "node-7",
            children: []
          }
        }
      },
      {
        id: "demo-5",
        title: "Machine Learning Basics",
        create_time: Date.now() / 1000 - 432000,
        update_time: Date.now() / 1000 - 432000,
        current_node: "node-10",
        moderation_results: [],
        mapping: {
          "node-9": {
            id: "node-9",
            message: {
              id: "msg-9",
              author: { role: "user" },
              content: {
                content_type: "text",
                parts: ["What's the difference between supervised and unsupervised learning?"]
              },
              create_time: Date.now() / 1000 - 432000
            },
            parent: null,
            children: ["node-10"]
          },
          "node-10": {
            id: "node-10",
            message: {
              id: "msg-10",
              author: { role: "assistant" },
              content: {
                content_type: "text",
                parts: ["Supervised learning uses labeled training data to learn patterns and make predictions on new data. Examples include classification (predicting categories) and regression (predicting continuous values). Unsupervised learning finds hidden patterns in data without labels, such as clustering similar data points or dimensionality reduction. The key difference is whether you have target labels to train on."]
              },
              create_time: Date.now() / 1000 - 432000 + 40
            },
            parent: "node-9",
            children: []
          }
        }
      }
    ];

    console.log('Creating demo file with data:', demoData);
    const testBlob = new Blob([JSON.stringify(demoData)], { type: 'application/json' });
    const testFile = new File([testBlob], "demo-conversations.json", { type: "application/json" });
    
    console.log('Calling handleFileSelect with demo file');
    const success = await handleFileSelect(testFile);
    console.log('Demo processing result:', success);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dot-pattern">
        <div className="w-full max-w-md space-y-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center"
          >
            <BrainCircuit className="w-12 h-12 text-foreground animate-pulse" />
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
    <div className="min-h-screen dot-pattern relative">
      {/* Grid Lines Background */}
      <div className="absolute inset-0 grid grid-cols-[1fr_2fr_1fr] grid-rows-[1fr_2fr_1fr] pointer-events-none">
        {/* Grid cells with borders */}
        <div className="border-r border-b border-border/30"></div>
        <div className="border-r border-b border-border/30"></div>
        <div className="border-b border-border/30"></div>
        <div className="border-r border-b border-border/30"></div>
        <div className="border-r border-b border-border/30"></div>
        <div className="border-b border-border/30"></div>
        <div className="border-r border-border/30"></div>
        <div className="border-r border-border/30"></div>
        <div></div>
      </div>
      
      {/* Main Content Container */}
      <div className="h-screen grid grid-rows-[1fr_2fr_1fr] relative z-10">
        
        {/* Top Section - Neural Visualizer Logo (Centered) */}
        <div className="flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <BrainCircuit className="w-8 h-8" />
            <span className="text-2xl font-medium">Neural Visualizer</span>
          </motion.div>
        </div>

        {/* Main Hero Section (Centered) */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8 max-w-4xl mx-auto px-8"
          >
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
                Transform your <span className="underline decoration-2 underline-offset-4">ChatGPT</span> conversations
                <br />
                <span className="text-muted-foreground">into interactive neural maps</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover patterns, explore connections, and visualize your intellectual journey through AI-powered 3D visualization.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleTryDemo}
                className="btn-minimal"
              >
                Try Demo
              </button>
              
              <button 
                onClick={() => router.push('/upload')}
                className="btn-minimal-outline"
              >
                Upload Your Data
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Credit Section */}
        <div className="flex items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              Created with ❤️ by{' '}
              <a 
                href="https://twitter.com/sarthak" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:underline transition-colors"
              >
                @Sarthak
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}