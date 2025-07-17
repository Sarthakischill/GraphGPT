"use client";

import { useState, useCallback, useContext } from "react";
import { Upload, FileText, CheckCircle, Play, X } from "lucide-react";
import { createTestDataBlob } from "@/utils/testData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { GraphDataContext } from "@/context/GraphDataContext";

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Start Your Journey</CardTitle>
          <CardDescription>Upload your `conversations.json` file or try our demo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`relative flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center transition-all ${isDragOver ? "border-primary bg-primary/10" : "border-input"} ${validationError ? "border-destructive" : ""}`}
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
            <Upload className={`h-12 w-12 text-muted-foreground ${isDragOver ? "text-primary" : ""}`} />
            <div className="text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              <p className="text-sm">ChatGPT `conversations.json` (Max 100MB)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button onClick={handleTryDemo} className="w-full" variant="secondary" disabled={isLoading}>
            <Play className="mr-2 h-4 w-4" /> Try with Demo Data
          </Button>
        </CardContent>
      </Card>

      {selectedFile && !isLoading && (
        <Card className="bg-secondary">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleFileChange(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {validationError && (
        <p className="text-sm text-destructive text-center">{validationError}</p>
      )}

      <Card className="border-blue-500/30 bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-blue-300">How to Export Your Data</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-200/80">
            <li>Go to ChatGPT Settings → Data Controls.</li>
            <li>Click "Export data" and confirm the request.</li>
            <li>You'll receive an email with a download link.</li>
            <li>Extract the ZIP and upload the `conversations.json` file.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}