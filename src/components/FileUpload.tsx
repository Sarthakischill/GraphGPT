"use client";

import { useState, useCallback, useContext } from "react";
import { Upload, FileText, CheckCircle, X, BrainCircuit } from "lucide-react";
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
      <Card className="glass">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-3 rounded-lg bg-accent/30 w-fit">
            <Upload className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-medium">Upload Your Data</CardTitle>
          <CardDescription className="text-muted-foreground">
            Upload your ChatGPT conversations.json file or try our demo
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Drop Zone */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative flex flex-col items-center justify-center space-y-6 rounded-lg border-2 border-dashed p-12 text-center transition-all duration-300 ${
              isDragOver 
                ? "border-foreground/30 bg-accent/20" 
                : validationError 
                  ? "border-destructive bg-destructive/5" 
                  : "border-border hover:border-foreground/20 hover:bg-accent/10"
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
              <div className={`mx-auto p-4 rounded-lg transition-colors ${
                isDragOver ? "bg-accent/30" : "bg-accent/20"
              }`}>
                <Upload className={`h-8 w-8 transition-colors ${
                  isDragOver ? "text-foreground" : "text-muted-foreground"
                }`} />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  ChatGPT conversations.json file (Max 100MB)
                </p>
              </div>
              
              <Badge variant="secondary" className="glass">
                <FileText className="w-3 h-3 mr-2" />
                JSON Format
              </Badge>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo Button */}
          <Button 
            onClick={handleTryDemo} 
            className="w-full btn-minimal-outline py-3" 
            disabled={isLoading}
          >
            Try Interactive Demo
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
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
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
                  className="btn-hover flex-shrink-0"
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
              <p className="text-sm text-destructive">{validationError}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <BrainCircuit className="w-5 h-5" />
            How to Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs flex-shrink-0">1</Badge>
                <p className="text-sm text-muted-foreground">Go to ChatGPT Settings → Data Controls</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs flex-shrink-0">2</Badge>
                <p className="text-sm text-muted-foreground">Click "Export data" and confirm</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs flex-shrink-0">3</Badge>
                <p className="text-sm text-muted-foreground">Wait for email with download link</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs flex-shrink-0">4</Badge>
                <p className="text-sm text-muted-foreground">Extract ZIP and upload conversations.json</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-accent/20 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Privacy:</strong> All processing happens locally in your browser. 
              Your data never leaves your device.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}