# Next Priority: Agent Chat Endpoint in Babocument

**Date**: November 7, 2025  
**Priority**: P0 - Critical  
**Estimate**: 4-6 hours  
**Repository**: babocument (C:\Users\b\src\babocument)  
**Issue**: #1 - Agent API Integration (Backend portion)

---

## Quick Start

### What to Do

**⚠️ WORK IN BABOCUMENT REPOSITORY, NOT HERE**

1. Navigate to: `C:\Users\b\src\babocument`
2. Create: `app/api/agent.py`
3. Modify: `app/main.py` to register the router
4. Test endpoint with curl
5. Test with beabodocl-babylon frontend

### Why This Is Next

- ✅ Frontend is complete and ready in beabodocl-babylon
- ✅ AgentCoordinator already exists in babocument
- ✅ LLM integration already configured
- ✅ Vector DB already set up
- ❌ Just missing the `/api/v1/agent/chat` endpoint

---

## Implementation Code

### File 1: C:\Users\b\src\babocument\app\api\agent.py (NEW)

```python
"""
Agent Chat API Endpoints

REST API for conversational AI agent interaction.
"""

from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from datetime import datetime
import structlog
import uuid

from app.agents.coordinator import AgentCoordinator
from app.services.vector_db import VectorDatabase, get_vector_db
from app.services.llm_client import LLMClient, get_llm_client

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/api/v1/agent", tags=["agent"])


# Pydantic Models
class ChatSource(BaseModel):
    """Source citation from agent"""
    title: str
    url: Optional[str] = None
    relevance: Optional[float] = None


class ChatRequest(BaseModel):
    """Request to chat with agent"""
    message: str
    conversation_id: Optional[str] = None
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    """Response from agent"""
    message: str
    conversation_id: str
    sources: Optional[List[ChatSource]] = None
    metadata: Optional[dict] = None


# Endpoints

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(
    request: ChatRequest,
    vector_db: VectorDatabase = Depends(get_vector_db),
    llm_client: LLMClient = Depends(get_llm_client)
):
    """
    Send message to AI agent and receive response.
    
    Uses the AgentCoordinator to handle conversational requests
    with context-aware responses, document search, and citations.
    """
    logger.info("agent_chat_request", 
                message=request.message[:100],
                conversation_id=request.conversation_id)
    
    try:
        # Initialize coordinator
        coordinator = AgentCoordinator(
            event_bus=None,
            vector_db=vector_db,
            llm_client=llm_client
        )
        
        # Handle conversation through coordinator
        context = request.context or {}
        result = await coordinator.handle_conversation(
            message=request.message,
            context=context
        )
        
        # Generate or retrieve conversation ID
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Format response
        response = ChatResponse(
            message=result.get("response", "I apologize, I couldn't process that request."),
            conversation_id=conversation_id,
            sources=[
                ChatSource(
                    title=src.get("title", ""),
                    url=src.get("url"),
                    relevance=src.get("relevance")
                )
                for src in result.get("sources", [])
            ],
            metadata=result.get("metadata")
        )
        
        logger.info("agent_chat_response", 
                    conversation_id=conversation_id,
                    response_length=len(response.message))
        
        return response
        
    except Exception as e:
        logger.error("agent_chat_error", error=str(e), exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )


@router.get("/conversations/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """
    Get conversation history (to be implemented with persistence).
    """
    # TODO: Implement conversation storage and retrieval
    raise HTTPException(
        status_code=501,
        detail="Conversation history not yet implemented"
    )


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """
    Delete conversation (to be implemented with persistence).
    """
    # TODO: Implement conversation deletion
    raise HTTPException(
        status_code=501,
        detail="Conversation deletion not yet implemented"
    )
```

### File 2: C:\Users\b\src\babocument\app\main.py (MODIFY)

Find the section where routers are registered (around line 140-150):

```python
# Register API routers
from app.api import documents, repositories, stats, agent  # ADD agent here

app.include_router(documents.router)
app.include_router(repositories.router)
app.include_router(stats.router)
app.include_router(agent.router)  # ADD this line
```

---

## Testing

### 1. Start Babocument Server

```powershell
cd C:\Users\b\src\babocument
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Test with Curl

```powershell
curl -X POST http://localhost:8000/api/v1/agent/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"What papers are available?\"}'
```

Expected response:
```json
{
  "message": "Here are the papers I found...",
  "conversation_id": "uuid-here",
  "sources": [...],
  "metadata": {...}
}
```

### 3. Test with Frontend

```powershell
cd C:\Users\b\src\beabodocl-babylon
npm run dev
```

Navigate to http://localhost:3000 and:
1. Scroll to "Agent Chat Test" section
2. Type a message
3. Click "Send Message"
4. Verify response appears

### 4. Test in VR

1. Ensure babocument is running on `http://192.168.1.200:8000`
2. Open beabodocl-babylon in VR browser
3. Test ChatPanel3D in 3D scene
4. Verify responses work in VR

---

## Troubleshooting

### Error: "Module 'agent' has no attribute 'router'"

**Fix**: Make sure `agent.py` has `router = APIRouter(...)` defined at module level

### Error: "AgentCoordinator object has no method 'handle_conversation'"

**Fix**: Check babocument version - method should exist in `app/agents/coordinator.py`

### Error: CORS issues from frontend

**Fix**: Add to `app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.200:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### No response or timeout

**Fix**: 
- Check Ollama is running: `ollama list`
- Check LLM client configuration in babocument
- Increase timeout in frontend API client

---

## Success Criteria

- [ ] Endpoint accessible at http://localhost:8000/api/v1/agent/chat
- [ ] Curl test returns valid JSON response
- [ ] AgentChatTest component works
- [ ] ChatPanel3D receives real responses
- [ ] Works in VR mode
- [ ] No errors in server logs
- [ ] No CORS errors in browser console

---

## Time Breakdown

- File creation: 30 min
- Router registration: 10 min
- Testing with curl: 20 min
- Frontend integration test: 30 min
- VR testing: 30 min
- Bug fixes: 1-2 hours
- **Total: 4-6 hours**

---

## References

- Full implementation details: `HANDOFF.md` in beabodocl-babylon
- Babocument repo: https://github.com/buddha314/babocument
- Frontend API client: `beabodocl-babylon/src/lib/api/agent.ts`
- Issue tracking: `beabodocl-babylon/GITHUB_ISSUES.md`

---

**Status**: Ready to implement  
**Blocker**: None - all dependencies complete  
**Next After This**: VR NavMesh (Issue #9) or VR Strafing (Issue #10)
