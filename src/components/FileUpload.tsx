"use client";

import { useState, useCallback, useContext } from "react";
import { Upload, FileText, CheckCircle, Play, X, Zap, BrainCircuit } from "lucide-react";
import { createTestDataBlob } from "@/utils/testData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { GraphDataContext } from "@/context/GraphDataContext";
import { motion } from "motion/react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { isLoading } = useContext(GraphDataContext);

  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith(".json")) {
      return "Invalid file type. Please upload the 'conversations.json' file from your ChatGPT export.";
    }
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return "File is too large (max 100MB).";
    }
    return null;
  };

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setValidationError(null);
      return;
    }
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
    } else {
      setValidationError(null);
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const onDragLeave = () => setIsDragOver(false);

  const handleTryDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const testBlob = createTestDataBlob();
    const testFile = new File([testBlob], "demo-conversations.json", { type: "application/json" });
    onFileSelect(testFile);
  };

  return (
    <div className="space-y-8">
      {/* Main Upload Card */}
      <Card className="glass card-hover">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Upload Your Data</CardTitle>
          <CardDescription className="text-base">
            Upload your ChatGPT conversations.json file or try our interactive demo
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Drop Zone */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex flex-col items-center justify-center space-y-6 rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
              isDragOver 
                ? "border-primary bg-primary/5 shadow-neural" 
                : validationError 
                  ? "border-destructive bg-destructive/5" 
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              disabled={isLoading}
            />
            
            <div className="space-y-4">
              <div className={`mx-auto p-4 rounded-full transition-colors ${
                isDragOver ? "bg-primary/20" : "bg-muted"
              }`}>
                <Upload className={`h-12 w-12 transition-colors ${
                  isDragOver ? "text-primary" : "text-muted-foreground"
                }`} />
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  <span className="text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-muted-foreground">
                  ChatGPT conversations.json file (Max 100MB)
                </p>
              </div>
              
              <Badge variant="secondary" className="glass">
                <FileText className="w-4 h-4 mr-2" />
                JSON Format Only
              </Badge>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <Badge variant="outline" className="glass">OR</Badge>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo Button */}
          <Button 
            onClick={handleTryDemo} 
            className="w-full btn-hover shadow-neural group py-6 text-lg" 
            variant="secondary" 
            disabled={isLoading}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Try Interactive Demo</div>
                <div className="text-sm text-muted-foreground">Explore with sample conversations</div>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Selected File Display */}
      {selectedFile && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-green-500/30 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-green-500/10">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to process
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleFileChange(null)}
                  className="btn-hover"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Validation Error */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <p className="text-sm text-destructive font-medium">{validationError}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions Card */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Export Your Data</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <Badge variant="outline" className="w-5 h-5 p-0 flex items-center justify-center text-xs">1</Badge>
                  Go to ChatGPT Settings → Data Controls
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline" className="w-5 h-5 p-0 flex items-center justify-center text-xs">2</Badge>
                  Click "Export data" and confirm
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline" className="w-5 h-5 p-0 flex items-center justify-center text-xs">3</Badge>
                  Wait for email with download link
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline" className="w-5 h-5 p-0 flex items-center justify-center text-xs">4</Badge>
                  Extract ZIP and upload conversations.json
                </li>
              </ol>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-primary">What Happens Next</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  AI analyzes your conversations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  Generates semantic embeddings
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  Creates 3D neural network
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  Reveals hidden patterns
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">🔒 Privacy First:</strong> All processing happens locally in your browser. 
              Your conversations never leave your device.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}