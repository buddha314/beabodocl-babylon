# User Stories

**Project**: Beabodocl-Babylon  
**Date Created**: November 7, 2025  
**Last Updated**: November 7, 2025

This document consolidates user stories from the Babocument project that inform the development of Beabodocl-Babylon.

## Table of Contents

1. [Agent-Assisted Paper Discovery](#agent-assisted-paper-discovery)
2. [DICOM Medical Imaging Visualization](#dicom-medical-imaging-visualization)
3. [Data Visualization Requirements](#data-visualization-requirements)

---

## Agent-Assisted Paper Discovery

### Summary

Enable users to discover scientific papers using natural language queries powered by AI agents, eliminating the need for manual database searches.

### User Story

> As a researcher, I want to ask an agent to find scientific papers for me using natural language, so I can quickly discover relevant research without manually searching through databases.

### Example Use Cases

Users can ask:

- "Find papers about bioink formulation for 3D printing"
- "Show me recent advances in CRISPR gene editing"
- "Papers by George Church about synthetic biology"
- "Compare different methods for tissue scaffolding"
- "What's new in biomanufacturing since 2023?"
- "Papers about CAR-T cell therapy with clinical trial data"

### Query Types Supported

- **Keyword-based**: "papers about CRISPR"
- **Author-based**: "papers by Jennifer Doudna"
- **Topic-based**: "recent advances in synthetic biology"
- **Comparative**: "compare bioink materials for tissue engineering"
- **Time-ranged**: "papers from last 5 years about biomanufacturing"
- **Citation-based**: "papers citing [specific paper]"

### Technical Requirements

#### Backend Components

- Enhance Research Agent with natural language processing
- Add query intent extraction (LLM-powered)
- Create `/api/v1/agents/search` endpoint
- Generate AI explanations for "why this matches"
- Integrate with semantic search and vector DB
- WebSocket events for search progress

#### Frontend Components

- `AgentSearchBar.tsx` - Natural language input with voice support
- `AgentSearchResults.tsx` - Results with AI explanations
- Agent avatar with "thinking" animation
- Real-time progress updates via WebSocket
- VR voice input integration

#### Query Processing Flow

1. User inputs natural language query
2. Research Agent processes with LLM
3. Extract intent (keywords, filters, time ranges)
4. Perform semantic search + external MCP sources
5. Rank results by relevance
6. Generate AI summaries and explanations
7. Return ranked results with scores
8. User can refine with follow-up questions

#### Response Format

- Ranked list of relevant papers
- Relevance score (0-1) displayed
- Brief AI-generated summary for each result
- Highlighting of query-relevant sections
- "Why this matches" explanation from agent
- Option to view full document or add to workspace

#### Performance Requirements

- Initial results within 2 seconds (local corpus)
- External repository results within 5 seconds
- Support concurrent searches
- Queue management for multiple users

### Success Metrics

- Users can ask questions in natural language
- Agent returns relevant papers with >80% relevance
- AI explanations are clear and accurate
- Voice input works in VR mode
- Average query response time <5 seconds
- Users can refine results with follow-up questions

### Priority

**P1 (High)** - Core user experience feature that transforms the application from a document viewer into an intelligent research assistant.

### Time Estimate

- Backend: 8-12 hours
- Frontend: 6-8 hours
- **Total: 14-20 hours**

---

## DICOM Medical Imaging Visualization

### Summary

Enable viewing of DICOM medical imaging data in 3D/VR and use AI agents to search open-source medical imaging repositories like The Cancer Imaging Archive (TCIA), finding relevant diagnostic images and scans.

### User Story

> As a researcher, I want to view DICOM medical imaging files in 3D/VR and ask agents to search medical imaging repositories, so I can analyze diagnostic images alongside scientific papers for comprehensive medical research.

### Example Use Cases

#### Viewing DICOM Files

- "Load this CT scan and show it in 3D"
- "Display this MRI series with volume rendering"
- "Show me slice-by-slice view of this brain scan"
- "Compare these two X-rays side by side"
- "View this ultrasound in VR with measurement tools"

#### Searching Medical Imaging Repositories

- "Find CT scans of lung cancer patients"
- "Show me brain MRIs with glioblastoma"
- "Search for breast cancer mammography images"
- "Get PET scans from melanoma studies"
- "Find cardiac CT scans with annotations"

#### Combined Research Workflow

- "Find papers about lung cancer treatment AND CT scans from TCIA"
- "Show me the imaging data referenced in this paper"
- "Compare imaging protocols across different studies"

### DICOM Standard Overview

**DICOM (Digital Imaging and Communications in Medicine)**

- Website: https://www.dicomstandard.org/
- Standard for medical imaging data
- Includes metadata (patient info, acquisition parameters, etc.)
- Supports multiple modalities: CT, MRI, X-Ray, Ultrasound, PET, etc.

**Common DICOM Tags:**

- Patient demographics (anonymized)
- Study/Series information
- Image dimensions and spacing
- Acquisition parameters
- Equipment details

### Medical Imaging Repositories

#### The Cancer Imaging Archive (TCIA)

- **URL**: https://www.cancerimagingarchive.net/
- **Content**: 200+ imaging collections, >60 million images
- **Modalities**: CT, MRI, PET, X-Ray, Pathology
- **REST API**: Available for programmatic access
- **Data**: Linked to clinical outcomes and genomic data

#### Other Open Repositories

1. **NIH Medical Imaging Commons**
   - Multi-institutional imaging data
   - Federated search across repositories

2. **OpenNeuro (neuroimaging)**
   - Brain MRI and fMRI datasets
   - BIDS format (compatible with DICOM)

3. **UK Biobank (restricted access)**
   - Large-scale population imaging
   - Multi-organ MRI data

4. **MIMIC-CXR (chest X-rays)**
   - 377,000+ chest X-ray images
   - Linked to electronic health records

### Technical Requirements

#### Phase 1: DICOM File Viewer (Backend)

**Time Estimate**: 8-12 hours

**Libraries Required:**
```python
# Required libraries
- pydicom: Parse DICOM files
- SimpleITK / itk: Medical image processing
- numpy: Array manipulation
- pillow: Image conversion
```

**Tasks:**

- Parse DICOM files and extract metadata
- Support multi-slice series (CT, MRI)
- Convert DICOM to web-friendly formats (PNG, JPG for 2D; NIfTI for 3D)
- Handle different modalities (CT, MRI, X-Ray, etc.)
- Anonymize patient data (remove PHI)
- Extract acquisition parameters

**Endpoints:**

```
POST   /api/v1/dicom/upload          # Upload DICOM files
GET    /api/v1/dicom/{id}            # Get DICOM metadata
GET    /api/v1/dicom/{id}/image      # Get image data
GET    /api/v1/dicom/{id}/series     # Get series information
GET    /api/v1/dicom/studies         # List all studies
POST   /api/v1/dicom/anonymize       # Anonymize DICOM data
```

**Files to Create:**

- `server/app/services/dicom_service.py`
- `server/app/api/routes/dicom.py`
- `server/app/models/dicom.py`
- `server/tests/test_dicom_service.py`

#### Phase 2: DICOM Visualization (Frontend)

**Time Estimate**: 12-16 hours

**2D Slice Viewer:**

- Display individual DICOM slices
- Windowing/Leveling controls (adjust brightness/contrast)
- Pan/zoom/rotate
- Measurement tools (distance, angle, area)
- Multi-planar reconstruction (MPR)

**3D Volume Rendering:**

- Volume rendering for CT/MRI series
- Adjustable transfer functions (opacity, color)
- Clipping planes
- Isosurface extraction
- Maximum Intensity Projection (MIP)

**VR/XR Features:**

- Immersive 3D volume viewing
- Gesture-based slice navigation
- Spatial measurement tools
- Multi-modal overlay (CT + PET)

**Libraries to Consider:**

- **Cornerstone.js** - 2D DICOM viewer (medical-grade)
- **AMI.js** - 3D medical imaging (BabylonJS compatible)
- **vtk.js** - 3D visualization toolkit
- **OHIF Viewer** - Full-featured DICOM viewer (heavy)

**Files to Create:**

- `client/src/components/dicom/DicomViewer.tsx`
- `client/src/components/dicom/Volume3D.tsx`
- `client/src/components/dicom/DicomControls.tsx`
- `client/src/lib/dicom/dicomLoader.ts`
- `client/src/lib/dicom/volumeRenderer.ts`

#### Phase 3: TCIA Integration (Backend)

**Time Estimate**: 10-14 hours

**Tasks:**

- Create TCIA API v4 client (REST)
- Implement search by collection/modality/body part
- Enhance Research Agent for imaging queries
- Add NLP processing for imaging-related queries
- Index Awesome DICOM repository into vector DB for RAG
- Enable agent to query DICOM knowledge base
- Create endpoints for imaging search
- Implement background download of DICOM series
- Store TCIA metadata in database
- Link imaging data to papers
- Add tests for TCIA integration

**TCIA API v4 Endpoints:**

```
GET /v4/query/getCollectionValues      # List collections
GET /v4/query/getModalityValues        # List modalities  
GET /v4/query/getBodyPartValues        # List body parts
GET /v4/query/getPatientStudy          # Get study info
GET /v4/query/getSeries                # Get series info
GET /v4/query/getImage                 # Download image
GET /v4/query/getSOPInstanceUIDs       # Get DICOM instance UIDs
```

**Files to Create:**

- `server/app/services/tcia_client.py` (TCIA API v4 client)
- `server/app/agents/imaging_agent.py` (with RAG support)
- `server/app/api/routes/imaging_search.py`
- `server/data/knowledge_bases/awesome_dicom.md` (indexed for RAG)
- `server/tests/test_tcia_integration.py`

#### Phase 4: Imaging Search UI (Frontend)

**Time Estimate**: 8-12 hours

**Tasks:**

- Create ImagingSearchBar component
- Add modality/body part filters
- Create ImagingResults component
- Display preview thumbnails
- Show DICOM metadata
- Implement download/view workflow
- Integrate with 3D scene
- Add VR voice search for imaging
- Test end-to-end workflow

**Files to Create:**

- `client/src/components/imaging/ImagingSearchBar.tsx`
- `client/src/components/imaging/ImagingResults.tsx`
- `client/src/components/imaging/ImagingPreview.tsx`
- `client/src/lib/api/imaging.ts`
- `client/src/lib/hooks/useImagingSearch.ts`

### Integrated Workflow Example

**Scenario**: Research lung cancer imaging

1. User asks: "Find papers about lung nodule detection"
2. Agent returns relevant papers
3. User asks: "Show me CT scans with lung nodules"
4. Agent searches TCIA for LIDC-IDRI collection
5. Returns preview images with metadata
6. User selects a series
7. Agent downloads DICOM files
8. Client displays 3D volume rendering in VR
9. User can annotate findings
10. Results saved alongside paper references

### Success Metrics

- Can upload and view DICOM files
- 2D slice viewer with windowing works
- 3D volume rendering displays correctly
- Can search TCIA by modality and body part
- Agent understands imaging-related queries
- VR volume viewing is smooth (>60 FPS)
- DICOM anonymization removes PHI
- Measurement tools are accurate
- Can link images to related papers

### Privacy & Compliance Considerations

#### HIPAA Compliance (if using patient data)

- **De-identification**: Remove all 18 PHI identifiers
- **Access controls**: User authentication and authorization
- **Audit logs**: Track all data access
- **Encryption**: At rest and in transit
- **Business Associate Agreements**: With repository providers

#### TCIA Data Use

- **Open access**: Most TCIA data is de-identified and public
- **Attribution**: Cite collection creators in publications
- **Data Use Agreements**: May be required for some collections
- **No redistribution**: Don't re-host TCIA data

#### Best Practices

- Anonymize before upload: Remove PHI client-side
- Secure storage: Encrypted database
- Limited retention: Delete data after analysis
- User training: HIPAA awareness for all users

### Cost & Resource Considerations

#### Storage

- DICOM files are large (CT series: 50-500 MB)
- Need adequate storage for temporary downloads
- Consider S3/cloud storage for production

#### Compute

- Volume rendering is GPU-intensive
- 3D reconstruction requires processing power
- May need dedicated GPU instances

#### Bandwidth

- TCIA downloads can be large
- Consider caching frequently accessed series
- Implement progressive loading for large files

### Priority

**P2 (Medium)** - Advanced feature for specialized medical research use cases.

### Total Time Estimate

- Backend: 18-26 hours
- Frontend: 20-28 hours
- **Total: 38-54 hours**

### Timeline

- **Week 1**: DICOM Backend
- **Week 2**: DICOM Frontend
- **Week 3**: TCIA Integration
- **Week 4**: Imaging Search UI

---

## Data Visualization Requirements

### Summary

Provide rich data visualizations to help users understand trends, patterns, and the evolution of research topics over time, integrated into the immersive VR/XR environment.

### Core Visualization Types

#### 1. Keyword Trend Line Graphs

**Purpose**: Display temporal trends of keyword frequency across the research corpus

**User Story**: 
> As a researcher, I want to see how frequently specific keywords appear in research papers over time, so I can understand the evolution and popularity of research topics.

**Features:**

- X-axis: Time (publication years)
- Y-axis: Keyword frequency/occurrence count
- Multi-line support: Compare up to 10 keywords
- Interactive legend: Toggle individual keyword lines
- Data points: Show exact values on hover
- Time range selection
- Normalization options: Absolute count, relative frequency, percentage

**Interactions:**

- Hover over data points to see exact values
- Click data point to view source documents
- Zoom into specific time ranges
- Export graph as PNG/SVG
- Export data as CSV/JSON

**Technical Implementation:**

- **Frontend**: Plotly.js for 2D/3D line graphs
- **Backend**: Analysis Agent calculates trend data
- **API Endpoint**: `/api/analytics/keyword-trends`
- **Caching**: Pre-computed trends for common keywords

#### 2. Word Clouds

**Purpose**: Visual representation of keyword importance and frequency

**User Story**:
> As a researcher, I want to see which keywords dominate my research corpus, so I can quickly understand the main themes and topics.

**Features:**

- Font size represents frequency/importance
- Color represents category or recency
- Interactive word selection
- Animated transitions when filtering
- Maximum 100 words displayed

**Interactions:**

- Click word to generate trend line graph
- Hover to show exact frequency
- Filter by year range
- Export as image

#### 3. 3D Scientific Plots (Plotly.js)

**Purpose**: Advanced scientific visualizations in immersive 3D space

**Supported Plot Types:**

- **3D Scatter Plots**: Document clustering in topic space
- **3D Surface Plots**: Keyword frequency heatmaps
- **3D Line Plots**: Trajectory of research trends
- **Heatmaps & Contour Plots**: Correlation matrices

**Integration Strategies:**

**Strategy A: Canvas Texture Mapping**
```javascript
// Render Plotly to offscreen canvas
const plotDiv = document.createElement('div');
Plotly.newPlot(plotDiv, data, layout, config);

// Convert to texture
const canvas = plotDiv.querySelector('canvas');
const texture = new BABYLON.Texture.CreateFromCanvas(canvas);

// Apply to mesh in BabylonJS
const plane = BABYLON.MeshBuilder.CreatePlane("plot", {size: 10});
plane.material.diffuseTexture = texture;
```

**Strategy B: HTML Overlay with WebGL**
```javascript
// Plotly in overlay div with transparent background
const overlay = document.getElementById('plotly-overlay');
Plotly.newPlot(overlay, data, layout, {
  displayModeBar: true,
  responsive: true
});
```

**Strategy C: Native BabylonJS Conversion**
```javascript
// Convert Plotly data to BabylonJS meshes
function plotlyToBabylon(plotlyData) {
  const points = plotlyData[0].x.map((x, i) =>
    new BABYLON.Vector3(x, plotlyData[0].y[i], plotlyData[0].z[i])
  );
  // Create point cloud or mesh
}
```

**Recommended Approach:**

- **Desktop Mode**: Strategy B (HTML overlay) for full Plotly interactivity
- **VR Mode**: Strategy A or C (texture/native) for performance and immersion
- **Hybrid**: Detect mode and switch strategies automatically

#### 4. Timeline Visualization

**Purpose**: Spatial representation of document distribution over time

**Visual Representation:**

- 3D corridor descending through time
- Glass partitions separating years
- Document cards positioned by date
- Year labels prominently displayed
- Density visualization

**Interactions:**

- Walk/fly through timeline
- Jump to specific years
- Filter documents by keyword (highlights in space)
- Scrubbing timeline control

#### 5. Journal Repository Management

**Purpose**: Allow users to discover, list, edit, and organize journal repositories

**Features:**

- Search for and discover new journal repositories
- Add/edit/remove repository connections
- Supported repositories:
  - arXiv (preprints)
  - PubMed/PubMed Central
  - bioRxiv/medRxiv
  - Custom institutional repositories
- Assign repositories to specific workspaces
- Track repository usage statistics

**API Endpoints:**

```
GET    /api/repositories           # List all repositories
POST   /api/repositories           # Add new repository
PUT    /api/repositories/{id}      # Update repository
DELETE /api/repositories/{id}      # Remove repository
POST   /api/repositories/{id}/test # Test connection
```

### UI Integration

#### 3D Environment Integration

**In-World Panels:**

- Floating 2D panels in VR space
- Anchored to workspace areas
- Scalable and repositionable
- Always face user (billboard mode)

**Locations:**

- Virtual lab workstations
- Librarian's desk area
- Floating panels in File Room

#### 2D UI Overlay

**Desktop Mode:**

- Sidebar panels
- Modal overlays for detailed views
- Dashboard landing page
- Export controls

**VR/XR Mode:**

- Hand-held tablet metaphor
- Gesture-controlled panels
- Voice-activated visualization requests

### Technical Dependencies

**Required:**

- **Plotly.js (v2.x)** - Primary visualization library
  - `plotly.js-dist` (full bundle) or `plotly.js-basic-dist` (smaller)
  - WebGL support for 3D plots
  - Install: `npm install plotly.js-dist`
- Analysis Agent
- Corpus database with full-text indexing
- Time-series data storage
- BabylonJS GUI for panel integration

**WebGL Context Considerations:**

- Plotly 3D plots use WebGL (same as BabylonJS)
- May need to manage shared WebGL context
- Test for WebGL context limit on target browsers
- Consider fallback to 2D plots on low-end hardware

### Performance Requirements

- Keyword trend query: < 500ms for cached data
- Word cloud generation: < 1s for 1000 documents
- Graph rendering: 60 FPS smooth animations
- Support corpus up to 100,000 documents

### Success Metrics

- 80% of users generate at least one trend graph per session
- 95% of queries return in < 1s
- Zero visualization rendering errors
- Reduces time to identify research trends by 50%

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guidelines
- [API_INTEGRATION.md](./API_INTEGRATION.md) - API integration details
- [SETUP.md](./SETUP.md) - Developer setup guide

---

**Status**: 📝 Documented - Ready for prioritization and implementation planning
