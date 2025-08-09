import dynamic from 'next/dynamic'

const Graph3D = dynamic(() => import('./Graph3DClient').then(mod => mod.Graph3D), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-300">Loading 3D visualization...</p>
    </div>
  </div>
})

export { Graph3D }
