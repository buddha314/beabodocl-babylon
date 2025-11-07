# API Integration Guide

## Backend API Overview

**Base URL:** `http://192.168.1.200:8000`  
**API Version:** v1  
**Base Path:** `/api/v1`

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://192.168.1.200:8000
```

**Note:** The `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the browser.

### Network Configuration

The API URL is set to a local network IP (`192.168.1.200`) to enable VR headset access when both devices are on the same network. For development on the same machine, you might want to use `http://localhost:8000`.

## API Client Structure

### Base Client (`src/lib/api/client.ts`)

**Features:**
- Axios instance with preconfigured baseURL
- Request/response interceptors for logging
- 30-second timeout
- Automatic JSON handling
- Health check method

**Usage:**
```typescript
import { apiClient } from '@/lib/api';

// Check if backend is available
const isHealthy = await apiClient.healthCheck();
```

### Type Definitions (`src/lib/api/types.ts`)

All API types are defined with TypeScript interfaces matching the backend FastAPI schema:

**Core Types:**
- `Document` - Research paper/document metadata
- `DocumentList` - Paginated document list
- `SearchResult` - Search result with scoring
- `SystemStats` - System statistics and metrics
- `ApiError` - Error response format

## API Modules

### Documents API (`src/lib/api/documents.ts`)

#### List Documents
```typescript
import { documentsApi } from '@/lib/api';

const result = await documentsApi.list({
  page: 1,
  page_size: 10,
  year_min: 2020,
  indexed_only: true
});

console.log(result.documents); // Array of documents
console.log(result.total);     // Total count
console.log(result.has_more);  // Pagination flag
```

**Parameters:**
- `page?: number` - Page number (default: 1)
- `page_size?: number` - Items per page (default: 20)
- `year_min?: number` - Filter by minimum year
- `year_max?: number` - Filter by maximum year
- `sources?: string[]` - Filter by source
- `indexed_only?: boolean` - Only indexed documents

#### Get Single Document
```typescript
const document = await documentsApi.get('document-id-123');

console.log(document.title);
console.log(document.authors);
console.log(document.abstract);
```

#### Get Document Content
```typescript
const content = await documentsApi.getContent('document-id-123');

console.log(content.full_text);
console.log(content.sections); // Array of sections with titles
```

#### Search Documents
```typescript
const results = await documentsApi.search({
  query: 'cancer treatment',
  search_type: 'semantic', // or 'keyword'
  limit: 10,
  filters: {
    year_min: 2018,
    sources: ['pubmed', 'arxiv']
  }
});

results.results.forEach(result => {
  console.log(result.title);
  console.log(result.score);
  console.log(result.highlights); // Matched text snippets
});
```

**Search Types:**
- `semantic` - Vector similarity search using embeddings
- `keyword` - Traditional text-based search

#### Upload Document
```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const response = await documentsApi.upload(file, {
  title: 'Custom Title',
  authors: ['Author 1', 'Author 2'],
  year: 2024,
  source: 'manual_upload'
});

console.log(response.document_id);
console.log(response.indexed); // Whether indexing completed
```

#### Delete Document
```typescript
await documentsApi.delete('document-id-123');
```

#### Get Document Summary
```typescript
const summary = await documentsApi.getSummary('document-id-123', 200);

console.log(summary.summary);
console.log(summary.generated_at);
```

### Stats API (`src/lib/api/stats.ts`)

#### Get System Statistics
```typescript
import { statsApi } from '@/lib/api';

const stats = await statsApi.getSystemStats();

console.log(stats.total_documents);
console.log(stats.indexed_documents);
console.log(stats.storage_used_mb);
console.log(stats.uptime_seconds);
```

**Response Fields:**
- `total_documents: number` - Total documents in system
- `indexed_documents: number` - Documents with embeddings
- `storage_used_mb: number` - Storage space used
- `uptime_seconds: number` - Server uptime
- `environment?: string` - Deployment environment

#### Get All Statistics
```typescript
const allStats = await statsApi.getAllStats();

console.log(allStats.system);                  // SystemStats
console.log(allStats.documents_by_year);       // { "2024": 50, "2023": 75 }
console.log(allStats.documents_by_source);     // { "pubmed": 100, "arxiv": 25 }
console.log(allStats.recent_uploads);          // Recent documents array
```

## Error Handling

### HTTP Error Responses

All API errors follow this format:

```typescript
interface ApiError {
  detail: string;
  status_code?: number;
}
```

### Handling Errors in Components

```typescript
import { AxiosError } from 'axios';
import { ApiError } from '@/lib/api';

try {
  const data = await documentsApi.list();
} catch (error) {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    console.error('API Error:', apiError.detail);
    console.error('Status Code:', error.response?.status);
  } else {
    console.error('Network Error:', error);
  }
}
```

### Common Error Scenarios

1. **Connection Failed** - Backend not running
   - Error: No response received
   - Solution: Start backend server

2. **Timeout** - Request took > 30 seconds
   - Error: Request timeout
   - Solution: Check backend performance

3. **404 Not Found** - Resource doesn't exist
   - Error: Document not found
   - Solution: Verify document ID

4. **500 Internal Server Error** - Backend error
   - Error: Server error details
   - Solution: Check backend logs

## Request/Response Logging

All API requests and responses are automatically logged to the browser console:

```
[API] GET /api/v1/stats
[API] 200 /api/v1/stats
```

For errors:
```
[API Error] 404: { detail: "Document not found" }
```

## Integration Examples

### React Component with API

```typescript
'use client';

import { useEffect, useState } from 'react';
import { documentsApi, Document } from '@/lib/api';

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);
      const result = await documentsApi.list({ page: 1, page_size: 20 });
      setDocuments(result.documents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {documents.map(doc => (
        <div key={doc.id}>{doc.title}</div>
      ))}
    </div>
  );
}
```

### 3D Scene with API

```typescript
import { apiClient } from '@/lib/api';

async function initializeScene(scene: Scene) {
  // Check backend connectivity before enabling chat
  const isHealthy = await apiClient.healthCheck();
  
  if (isHealthy) {
    const chatPanel = new ChatPanel3D(scene, new Vector3(0, 2, 5));
    console.log('Chat panel initialized with backend connection');
  } else {
    console.warn('Backend not available, chat features disabled');
  }
}
```

## Future API Endpoints (TODO)

### Agent Chat (Not Yet Implemented)

```typescript
// Planned endpoint: POST /api/v1/agent/chat
interface ChatRequest {
  message: string;
  context?: {
    document_ids?: string[];
    conversation_history?: ChatMessage[];
  };
}

interface ChatResponse {
  response: string;
  sources?: Document[];
  confidence?: number;
}

// Future implementation in ChatPanel3D
async function sendToAgent(message: string): Promise<string> {
  const response = await axios.post('/api/v1/agent/chat', {
    message,
    context: {}
  });
  return response.data.response;
}
```

### Repositories Management

```typescript
// Planned endpoints for MCP repository management
interface Repository {
  id: string;
  name: string;
  type: 'mcp' | 'local' | 'external';
  url?: string;
  status: 'active' | 'inactive' | 'error';
}

// GET /api/v1/repositories
// POST /api/v1/repositories
// DELETE /api/v1/repositories/{id}
```

## Testing API Connectivity

### Health Check

The health check endpoint is available at `/health` (note: not under `/api/v1`):

```typescript
const response = await fetch('http://192.168.1.200:8000/health');
// Response: { status: "healthy" }
```

### ApiTest Component

The project includes an `ApiTest` component that displays:
- Connection status (green/red indicator)
- System statistics
- Recent documents
- Refresh functionality

This component is rendered as an overlay in the top-right corner and is useful for debugging API connectivity.

## CORS Configuration

The backend must have CORS enabled to allow requests from the frontend:

```python
# Backend CORS configuration (FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.200:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Performance Optimization

### Caching Strategies

Current implementation does not cache API responses. For production:

1. **React Query** - Consider implementing for automatic caching
2. **SWR** - Alternative caching solution
3. **Local Storage** - Cache document metadata
4. **Service Worker** - Offline support

### Request Optimization

- Use pagination to limit response size
- Implement debouncing for search queries
- Lazy load document content
- Prefetch related documents

## Security Considerations

### Current State (Development)
- No authentication
- No authorization
- No rate limiting
- API URL in client code

### Production Recommendations
1. Implement JWT authentication
2. Add API key management
3. Enable HTTPS only
4. Add request signing
5. Implement rate limiting
6. Use environment-specific API URLs
7. Sanitize all user inputs
