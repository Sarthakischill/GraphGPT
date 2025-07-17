# Chat History Visualizer

Transform your ChatGPT conversations into an interactive 3D neural map. Discover patterns, explore connections, and visualize your intellectual journey.

## Features

- **3D Neural Map**: Visualize conversations as interconnected nodes in 3D space
- **AI-Powered Clustering**: Uses Google's Gemini AI to generate embeddings and identify similar conversations
- **Interactive Controls**: Adjust similarity thresholds, node sizes, and color schemes
- **Detailed Insights**: Comprehensive analytics dashboard with conversation patterns and trends
- **Conversation Explorer**: Browse and search through all your conversations

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google AI API Key (from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-history-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### How to Export Your ChatGPT Data

1. Go to ChatGPT Settings → Data Controls
2. Click "Export data" and confirm your request
3. Wait for the email with your download link (usually takes a few minutes)
4. Extract the ZIP file and locate the `conversations.json` file
5. Upload this file to the Chat History Visualizer

## Usage

1. **Upload Your Data**: Drag and drop your `conversations.json` file or click to browse
2. **Enter API Key**: Provide your Google AI API key when prompted
3. **Wait for Processing**: The app will parse, clean, and generate embeddings for your conversations
4. **Explore Your Neural Map**: 
   - Use the 3D visualization to explore conversation clusters
   - Adjust controls to change similarity thresholds and visual settings
   - Click on nodes to view conversation details
   - Switch to the Insights tab for analytics

## Features Overview

### 3D Visualization
- **Nodes**: Each conversation appears as a colored sphere
- **Edges**: Lines connect similar conversations
- **Clusters**: Related conversations are grouped and color-coded
- **Interactive**: Click, drag, and zoom to explore

### Control Panel
- **Similarity Threshold**: Adjust how similar conversations need to be to show connections
- **Node Size**: Scale nodes by message count, word count, or uniform size
- **Color Schemes**: Color by cluster, date, or topic
- **Edge Controls**: Show/hide connections and adjust thickness

### Insights Dashboard
- **Overview Statistics**: Total conversations, messages, and words
- **Activity Timeline**: See your conversation patterns over time
- **Topic Analysis**: Discover your most discussed subjects
- **Sentiment Analysis**: Understand the emotional tone of your conversations
- **Cluster Analysis**: Explore grouped conversation themes

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **3D Visualization**: 3d-force-graph.js with WebGL
- **AI Processing**: Google Gemini AI for embeddings
- **Styling**: Tailwind CSS with custom neural-themed components

## Privacy & Security

- Your API key is used locally and never stored on our servers
- All conversation processing happens in your browser
- No conversation data is sent to external services except for embedding generation
- Your data remains private and secure

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── services/           # Business logic and API services
├── types/              # TypeScript type definitions
└── workers/            # Web workers for heavy computations
```

### Key Components

- `FileUpload`: Handles ChatGPT export file upload and validation
- `Graph3D`: 3D visualization using 3d-force-graph
- `VisualizationContainer`: Main container with tabs and panels
- `ControlPanel`: Interactive controls for customizing the visualization
- `InsightsDashboard`: Analytics and statistics view
- `ConversationDetail`: Detailed view of individual conversations

### Services

- `ChatParser`: Parses and cleans ChatGPT export data
- `EmbeddingService`: Generates AI embeddings using Google Gemini
- `GraphBuilder`: Constructs the 3D graph from processed data
- `ProcessingService`: Orchestrates the entire processing pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section below
2. Open an issue on GitHub
3. Review the documentation

## Troubleshooting

### Common Issues

**"Invalid API Key" Error**
- Ensure your Google AI API key starts with "AIza"
- Verify the key is active in Google AI Studio
- Check for any extra spaces or characters

**"No Valid Conversations Found"**
- Ensure you're uploading the `conversations.json` file (not the entire ZIP)
- Check that your ChatGPT export contains actual conversations
- Try exporting your data again if the file seems corrupted

**Slow Processing**
- Large conversation histories may take several minutes to process
- The app processes conversations in batches to respect API rate limits
- Consider using a smaller subset of conversations for testing

**3D Visualization Not Loading**
- Ensure your browser supports WebGL
- Try refreshing the page
- Check browser console for any JavaScript errors

### Performance Tips

- For large datasets (1000+ conversations), consider adjusting the similarity threshold to reduce connections
- Use the "Uniform" node size option for better performance with many conversations
- Hide edges if the visualization becomes too cluttered

## Roadmap

- [ ] Export visualization as images or videos
- [ ] Support for other chat platforms (Discord, Slack, etc.)
- [ ] Advanced clustering algorithms
- [ ] Conversation search and filtering
- [ ] Collaborative features for shared analysis
- [ ] Mobile-responsive 3D visualization