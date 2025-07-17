"use client";

import { useState, useCallback, useContext } from "react";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import { createTestDataBlob } from "@/utils/testData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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

  const handleFileChange = useCallback(
    (file: File | null) => {
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
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileChange(files[0]);
      }
    },
    [handleFileChange]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave = () => setIsDragOver(false);

  const handleTryDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const testBlob = createTestDataBlob();
    const testFile = new File([testBlob], "demo-conversations.json", {
      type: "application/json",
    });
    onFileSelect(testFile);
  };

  return (
    <div className="space-y-8">
      {/* Clean Upload Area */}
      <div className="space-y-6">
        {/* File Drop Zone */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center transition-all duration-300 ${
            isDragOver
              ? "border-foreground/40 bg-accent/20"
              : validationError
              ? "border-destructive/40 bg-destructive/5"
              : "border-border/40 hover:border-foreground/30 hover:bg-accent/10"
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
            <Upload
              className={`h-12 w-12 mx-auto transition-colors ${
                isDragOver ? "text-foreground" : "text-muted-foreground"
              }`}
            />

            <div className="space-y-2">
              <p className="text-lg font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                ChatGPT conversations.json file (Max 100MB)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Demo Button */}
        <div className="text-center">
          <Button
            onClick={handleTryDemo}
            variant="outline"
            className="px-8 py-3 btn-hover glass"
            disabled={isLoading}
          >
            Try Interactive Demo
          </Button>
        </div>
      </div>

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
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                    to process
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

      {/* Simple Instructions */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="font-medium">How to get your ChatGPT data</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>1. Go to ChatGPT Settings → Data Controls</p>
              <p>2. Click "Export data" and wait for the email</p>
              <p>3. Extract the ZIP and upload conversations.json</p>
            </div>
            <div className="text-xs text-muted-foreground pt-4 border-t border-border/50">
              All processing happens locally in your browser
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
