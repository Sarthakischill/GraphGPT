'use client'

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { GraphDataContext } from '@/context/GraphDataContext';
import { Loader2, Network, Eye, Zap, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroHighlight } from '@/components/ui/hero-highlight';
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
        <div className="max-w-6xl mx-auto px-4 py-20">
          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Explore Your Conversations Like Never Before
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered analysis reveals hidden patterns in your ChatGPT history
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full bg-black/20 border-white/10">
                <CardHeader>
                  <Network className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-white">3D Neural Network</CardTitle>
                  <CardDescription className="text-gray-300">
                    See your conversations as interconnected nodes in beautiful 3D space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Each conversation becomes a node, with connections showing semantic similarity. 
                    Rotate, zoom, and explore your knowledge graph intuitively.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full bg-black/20 border-white/10">
                <CardHeader>
                  <Eye className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-white">Smart Insights</CardTitle>
                  <CardDescription className="text-gray-300">
                    Discover patterns and trends in your conversation history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    AI-powered analysis reveals topic clusters, conversation evolution, 
                    and knowledge domains you explore most frequently.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full bg-black/20 border-white/10">
                <CardHeader>
                  <Zap className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-white">Interactive Controls</CardTitle>
                  <CardDescription className="text-gray-300">
                    Customize the visualization to focus on what matters to you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Adjust similarity thresholds, filter by date ranges, 
                    and customize the appearance to explore different perspectives.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <Upload className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Explore Your Mind?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Upload your ChatGPT export and start your journey
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <FileUpload onFileSelect={handleFileSelect} />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Alert variant="destructive">
                  <AlertTitle>Processing Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12"
            >
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">How to Export Your Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-300">
                  <p>1. Go to ChatGPT Settings → Data Controls</p>
                  <p>2. Click "Export data" and confirm your request</p>
                  <p>3. Wait for the email with your download link</p>
                  <p>4. Extract the ZIP file and upload the conversations.json file here</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </HeroHighlight>
    </main>
  );
}