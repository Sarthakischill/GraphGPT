'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraphDataContext } from '@/context/GraphDataContext';
import { VisualizationContainer } from '@/components/VisualizationContainer';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { graph, isLoading } = useContext(GraphDataContext);
  const router = useRouter();

  // Debug: Log what we receive in dashboard
  console.log('DashboardPage: Context state', {
    hasGraph: !!graph,
    isLoading,
    nodeCount: graph?.nodes?.length || 0,
    edgeCount: graph?.edges?.length || 0
  });

  useEffect(() => {
    // If there's no graph data and we're not loading, redirect to home
    if (!isLoading && !graph) {
      console.log('DashboardPage: No graph data, redirecting to home');
      router.replace('/');
    }
  }, [graph, isLoading, router]);

  if (isLoading || !graph) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading visualization...</p>
        </div>
      </div>
    );
  }

  return <VisualizationContainer initialGraph={graph} />;
}