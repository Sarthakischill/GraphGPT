'use client'

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { GraphDataContext } from '@/context/GraphDataContext';
import { Loader2, ArrowRight, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
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
    // Create demo data that matches ChatGPT export format
    const demoData = {
      conversations: [
        {
          id: "demo-1",
          title: "JavaScript Best Practices",
          create_time: Date.now() / 1000 - 86400, // 1 day ago
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
          create_time: Date.now() / 1000 - 172800, // 2 days ago
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
          create_time: Date.now() / 1000 - 259200, // 3 days ago
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
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xl font-medium text-primary">
            <Loader2 className="w-8 h-8 animate-spin" />
            Processing Your Universe of Ideas...
          </div>
          {progress && (
            <>
              <Progress value={progress.progress} className="w-full" />
              <p className="text-muted-foreground">{progress.message}</p>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroHighlight containerClassName="min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-center space-y-4 max-w-xl mx-auto px-4"
        >
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-white leading-tight">
            Visualize Your<br/>
            <Highlight className="text-black dark:text-white">
              ChatGPT History
            </Highlight><br/>
            in 3D Space
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Transform your conversations into an interactive neural network.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            <Button 
              onClick={handleTryDemo}
              size="default" 
              className="bg-primary hover:bg-primary/90"
            >
              Try Demo
            </Button>
            <Button 
              variant="outline" 
              size="default"
              onClick={() => router.push('/upload')}
            >
              Upload Your Data
            </Button>
          </div>
        </motion.div>
      </HeroHighlight>
    </main>
  );
}