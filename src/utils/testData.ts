import { RawConversation } from '@/types';

export function generateTestData(): RawConversation[] {
  const testConversations: RawConversation[] = [
    {
      id: 'test-1',
      title: 'Learning React Hooks',
      create_time: Date.now() / 1000 - 86400 * 7, // 7 days ago
      update_time: Date.now() / 1000 - 86400 * 7,
      current_node: 'node-4',
      moderation_results: [],
      mapping: {
        'node-1': {
          id: 'node-1',
          message: {
            id: 'msg-1',
            author: { role: 'user' },
            content: {
              content_type: 'text',
              parts: ['Can you explain React hooks and how they work?']
            },
            create_time: Date.now() / 1000 - 86400 * 7
          },
          parent: null,
          children: ['node-2']
        },
        'node-2': {
          id: 'node-2',
          message: {
            id: 'msg-2',
            author: { role: 'assistant' },
            content: {
              content_type: 'text',
              parts: ['React Hooks are functions that let you use state and other React features in functional components. The most common hooks are useState for managing state and useEffect for side effects.']
            },
            create_time: Date.now() / 1000 - 86400 * 7 + 60
          },
          parent: 'node-1',
          children: ['node-3']
        },
        'node-3': {
          id: 'node-3',
          message: {
            id: 'msg-3',
            author: { role: 'user' },
            content: {
              content_type: 'text',
              parts: ['Can you show me an example of useState?']
            },
            create_time: Date.now() / 1000 - 86400 * 7 + 120
          },
          parent: 'node-2',
          children: ['node-4']
        },
        'node-4': {
          id: 'node-4',
          message: {
            id: 'msg-4',
            author: { role: 'assistant' },
            content: {
              content_type: 'text',
              parts: ['Sure! Here\'s a simple example:\n\nconst [count, setCount] = useState(0);\n\nThis creates a state variable called count with an initial value of 0, and setCount is the function to update it.']
            },
            create_time: Date.now() / 1000 - 86400 * 7 + 180
          },
          parent: 'node-3',
          children: []
        }
      }
    },
    {
      id: 'test-2',
      title: 'JavaScript Array Methods',
      create_time: Date.now() / 1000 - 86400 * 5, // 5 days ago
      update_time: Date.now() / 1000 - 86400 * 5,
      current_node: 'node-6',
      moderation_results: [],
      mapping: {
        'node-5': {
          id: 'node-5',
          message: {
            id: 'msg-5',
            author: { role: 'user' },
            content: {
              content_type: 'text',
              parts: ['What are the most useful JavaScript array methods I should know?']
            },
            create_time: Date.now() / 1000 - 86400 * 5
          },
          parent: null,
          children: ['node-6']
        },
        'node-6': {
          id: 'node-6',
          message: {
            id: 'msg-6',
            author: { role: 'assistant' },
            content: {
              content_type: 'text',
              parts: ['The most essential JavaScript array methods include: map() for transforming arrays, filter() for filtering elements, reduce() for aggregating data, forEach() for iteration, find() for finding elements, and includes() for checking existence.']
            },
            create_time: Date.now() / 1000 - 86400 * 5 + 60
          },
          parent: 'node-5',
          children: []
        }
      }
    },
    {
      id: 'test-3',
      title: 'CSS Grid vs Flexbox',
      create_time: Date.now() / 1000 - 86400 * 3, // 3 days ago
      update_time: Date.now() / 1000 - 86400 * 3,
      current_node: 'node-8',
      moderation_results: [],
      mapping: {
        'node-7': {
          id: 'node-7',
          message: {
            id: 'msg-7',
            author: { role: 'user' },
            content: {
              content_type: 'text',
              parts: ['When should I use CSS Grid vs Flexbox?']
            },
            create_time: Date.now() / 1000 - 86400 * 3
          },
          parent: null,
          children: ['node-8']
        },
        'node-8': {
          id: 'node-8',
          message: {
            id: 'msg-8',
            author: { role: 'assistant' },
            content: {
              content_type: 'text',
              parts: ['Use CSS Grid for two-dimensional layouts (rows and columns) and complex page layouts. Use Flexbox for one-dimensional layouts (either row or column) and component-level alignment. Grid is better for overall page structure, while Flexbox excels at distributing space within components.']
            },
            create_time: Date.now() / 1000 - 86400 * 3 + 60
          },
          parent: 'node-7',
          children: []
        }
      }
    },
    {
      id: 'test-4',
      title: 'Python Data Structures',
      create_time: Date.now() / 1000 - 86400 * 10, // 10 days ago
      update_time: Date.now() / 1000 - 86400 * 10,
      current_node: 'node-10',
      moderation_results: [],
      mapping: {
        'node-9': {
          id: 'node-9',
          message: {
            id: 'msg-9',
            author: { role: 'user' },
            content: {
              content_type: 'text',
              parts: ['What are the main data structures in Python and when to use each?']
            },
            create_time: Date.now() / 1000 - 86400 * 10
          },
          parent: null,
          children: ['node-10']
        },
        'node-10': {
          id: 'node-10',
          message: {
            id: 'msg-10',
            author: { role: 'assistant' },
            content: {
              content_type: 'text',
              parts: ['Python\'s main data structures are: Lists (ordered, mutable), Tuples (ordered, immutable), Dictionaries (key-value pairs), Sets (unique elements), and Strings (immutable sequences). Choose based on whether you need ordering, mutability, and uniqueness constraints.']
            },
            create_time: Date.now() / 1000 - 86400 * 10 + 60
          },
          parent: 'node-9',
          children: []
        }
      }
    },
    {
      id: 'test-5',
      title: 'Machine Learning Basics',
      create_time: Date.now() / 1000 - 86400 * 2, // 2 days ago
      update_time: Date.now() / 1000 - 86400 * 2,
      current_node: 'node-12',
      moderation_results: [],
      mapping: {
        'node-11': {
          id: 'node-11',
          message: {
            id: 'msg-11',
            author: { role: 'user' },
            content: {
              content_type: 'text',
              parts: ['Can you explain the difference between supervised and unsupervised learning?']
            },
            create_time: Date.now() / 1000 - 86400 * 2
          },
          parent: null,
          children: ['node-12']
        },
        'node-12': {
          id: 'node-12',
          message: {
            id: 'msg-12',
            author: { role: 'assistant' },
            content: {
              content_type: 'text',
              parts: ['Supervised learning uses labeled training data to learn patterns and make predictions (like classification and regression). Unsupervised learning finds hidden patterns in unlabeled data (like clustering and dimensionality reduction). The key difference is whether you have target labels during training.']
            },
            create_time: Date.now() / 1000 - 86400 * 2 + 60
          },
          parent: 'node-11',
          children: []
        }
      }
    }
  ];

  return testConversations;
}

export function createTestDataBlob(): Blob {
  const testData = generateTestData();
  const jsonString = JSON.stringify(testData, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
}