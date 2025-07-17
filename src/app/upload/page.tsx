'use client'

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { GraphDataContext } from '@/context/GraphDataContext';
import { ArrowLeft, BrainCircuit, BarChart3, AppWindow } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

export default function UploadPage() {
  const { processAndSetGraphData, isLoading, progress, error } = useContext(GraphDataContext);
  const router = useRouter();

  const handleFileSelect = async (file: File) => {
    const success = await processAndSetGraphData(file);
    if (success) {
      router.push('/dashboard');
    }
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
    <div className="min-h-screen dot-pattern">
      <div className="container mx-auto px-8 py-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <BrainCircuit className="w-8 h-8" />
            <span className="text-xl font-medium">Neural Visualizer</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-medium mb-6">
            Transform Your Conversations
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Upload your ChatGPT export to reveal hidden patterns and connections in your conversations through AI-powered 3D visualization
          </p>
          
          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 p-3 rounded-lg bg-accent/30">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-medium mb-2">3D Neural Map</h3>
              <p className="text-sm text-muted-foreground">Interactive 3D visualization of conversation clusters</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 p-3 rounded-lg bg-accent/30">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-medium mb-2">Smart Insights</h3>
              <p className="text-sm text-muted-foreground">AI-powered analysis of topics and patterns</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 p-3 rounded-lg bg-accent/30">
                <AppWindow className="w-6 h-6" />
              </div>
              <h3 className="font-medium mb-2">Conversation Explorer</h3>
              <p className="text-sm text-muted-foreground">Browse and search through all conversations</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <FileUpload onFileSelect={handleFileSelect} />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Alert variant="destructive" className="glass">
                <AlertTitle>Processing Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-32">
        <div className="container mx-auto px-8 py-8">
          <div className="text-center">
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
          </div>
        </div>
      </footer>
    </div>
  );
}