'use client';

import { createContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { ProcessingService } from '@/services/processingService';
import { ConversationGraph, ProcessingProgress, VisualizationControls, Conversation, ConversationEmbedding } from '@/types';

interface GraphDataContextType {
  graph: ConversationGraph | null;
  isLoading: boolean;
  progress: ProcessingProgress | null;
  error: string | null;
  processAndSetGraphData: (file: File) => Promise<boolean>;
  rebuildGraphWithControls: (controls: VisualizationControls) => Promise<ConversationGraph | null>;
}

export const GraphDataContext = createContext<GraphDataContextType>({
  graph: null,
  isLoading: false,
  progress: null,
  error: null,
  processAndSetGraphData: async () => false,
  rebuildGraphWithControls: async () => null,
});

export const GraphDataProvider = ({ children }: { children: ReactNode }) => {
  const [graph, setGraph] = useState<ConversationGraph | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Store raw data needed for rebuilding the graph
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [embeddings, setEmbeddings] = useState<ConversationEmbedding[]>([]);
  const [similarityMatrix, setSimilarityMatrix] = useState<Map<string, Map<string, number>>>(new Map());

  const processingService = useMemo(() => new ProcessingService(), []);

  const processAndSetGraphData = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setGraph(null);

    const isDemoFile = file.name === 'demo-conversations.json';
        
    try {
      const { graph: resultGraph, rawData } = await processingService.processFile(
        file,
        (progressUpdate) => setProgress(progressUpdate),
        isDemoFile
      );
      
      setGraph(resultGraph);
      setConversations(rawData.conversations);
      setEmbeddings(rawData.embeddings);
      setSimilarityMatrix(rawData.similarityMatrix);
            
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during processing.';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [processingService]);

  const rebuildGraphWithControls = useCallback(async (controls: VisualizationControls): Promise<ConversationGraph | null> => {
    if (conversations.length === 0 || embeddings.length === 0 || similarityMatrix.size === 0) {
      setError("Cannot rebuild graph: missing raw data.");
      return null;
    }

    try {
      const rebuiltGraph = await processingService.rebuildGraph(
        conversations,
        embeddings,
        similarityMatrix,
        controls
      );
      setGraph(rebuiltGraph);
      return rebuiltGraph;
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during graph rebuild.';
      setError(errorMessage);
      return null;
    }
  }, [conversations, embeddings, similarityMatrix, processingService]);

  return (
    <GraphDataContext.Provider value={{ graph, isLoading, progress, error, processAndSetGraphData, rebuildGraphWithControls }}>
      {children}
    </GraphDataContext.Provider>
  );
};