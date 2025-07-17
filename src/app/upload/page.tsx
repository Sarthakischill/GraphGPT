'use client'

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { GraphDataContext } from '@/context/GraphDataContext';
import { Loader2, Network, Eye, Zap, Upload, ArrowLeft, BrainCircuit, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      {/* Header */}
      <div className="border-b border-border/50 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="btn-hover"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Chat History Visualizer</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="glass px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Neural Network Analysis
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Conversations
            <span className="block gradient-text mt-2">Into Living Knowledge</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Advanced AI-powered analysis reveals hidden patterns and connections in your ChatGPT history
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Explore Your Mind?
            </h2>
            <p className="text-xl text-muted-foreground">
              Upload your ChatGPT export and start your journey
            </p>
          </div>

          <div className="space-y-8">
            <FileUpload onFileSelect={handleFileSelect} />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="destructive" className="glass">
                  <AlertTitle>Processing Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    How to Export Your ChatGPT Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-0.5">1</Badge>
                        <p className="text-sm">Go to ChatGPT Settings → Data Controls</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-0.5">2</Badge>
                        <p className="text-sm">Click "Export data" and confirm your request</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-0.5">3</Badge>
                        <p className="text-sm">Wait for the email with your download link</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-0.5">4</Badge>
                        <p className="text-sm">Extract the ZIP file and upload conversations.json here</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Privacy Note:</strong> Your data is processed locally in your browser. 
                      No conversation content is stored on our servers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}