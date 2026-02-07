# HAYAT Architecture

## System Overview

HAYAT is built as a React Native mobile application with a multi-agent AI system architecture. The app uses a centralized orchestrator (Lyra) to coordinate specialized AI agents that monitor and act on behalf of the family.

## Architecture Layers

### 1. Presentation Layer

**Components:**
- `AgentWidget` - Persistent status widgets for each agent
- `Chatbot` - Unified conversational interface
- `ActionExplanationModal` - "Why am I seeing this?" explanations

**Screens:**
- `AuthScreen` - UAE Pass authentication
- `HomeScreen` - Main screen with widgets and chatbot

### 2. Agent Layer

**Base Agent (`BaseAgent`)**
- Abstract base class for all agents
- Provides common functionality (monitoring, evaluation, explanation)
- Handles trace creation and widget state generation

**Specialized Agents:**
1. **FamilyGuardianAgent** - Orchestrator agent
   - Maintains family structure
   - Coordinates other agents
   - Validates family member information

2. **ResidencyIdentityAgent** - Visa & ID tracking
   - Monitors visa expiry (ICP/GDRFA)
   - Tracks Emirates ID expiry
   - Explains consequences by residency type
   - Auto-prepares renewal workflows

3. **ComplianceSentinelAgent** - Fine monitoring
   - Tracks parking fines (Dubai + Abu Dhabi)
   - Monitors discount windows (24-48h)
   - Escalates tone (friendly → urgent → formal)
   - Initiates UAE Pass payments

4. **WellBeingAgent** - Health & compliance
   - Tracks mandatory vaccinations
   - Monitors medical fitness tests
   - Tracks insurance validity
   - Uses Uplift AI for risk prioritization

### 3. Orchestration Layer

**LyraOrchestrator**
- Registers and manages all agents
- Coordinates monitoring cycles
- Aggregates decisions from agents
- Provides unified interface for agent actions

### 4. Service Layer

**Core Services:**
- `lyra.ts` - Multi-agent orchestration
- `trace.ts` - Explainability and auditability
- `crustdata.ts` - Real-time event simulation
- `uae-pass.ts` - Authentication and payments
- `uplift.ts` - Risk assessment
- `chatbot.ts` - Conversational interface

### 5. Data Layer

**State Management:**
- Zustand store (`useAppStore`)
  - Authentication state
  - Chat messages
  - Agent widget states

**Data Types:**
- Family structure (sponsor, members, dependencies)
- Visa and Emirates ID statuses
- Parking fines
- Vaccination requirements
- Medical fitness tests
- Insurance statuses

## Data Flow

### Monitoring Cycle

1. **LyraOrchestrator** triggers monitoring (every 60s)
2. Each **Agent** evaluates its domain
3. Agents return **AgentStatus** and **AgentActions**
4. Widget states are updated in store
5. UI components re-render with new states

### User Interaction Flow

1. User interacts with widget or chatbot
2. **HomeScreen** handles the interaction
3. Agent is queried for explanation (via Trace)
4. **ActionExplanationModal** displays explanation
5. User confirms action
6. **LyraOrchestrator** executes action through agent
7. Widget states update
8. Chatbot confirms completion

### Chatbot Flow

1. User sends message
2. **ChatbotService** processes message
3. Routes to appropriate agent or generates response
4. Response added to chat messages
5. UI updates with new message

## Explainability & Auditability

### Trace System

Every agent action creates a **TraceEntry** with:
- Agent ID
- Action type
- Reasoning
- Data snapshot
- Timestamp
- User ID

**Trace Flow:**
1. Agent creates action
2. Agent calls `createTrace()` with reasoning
3. **TraceService** stores trace entry
4. User can view explanation via "Why am I seeing this?"
5. Full audit trail available

## Security

### Authentication
- UAE Pass integration
- Secure token storage
- Session management

### Data Privacy
- Family data stored locally (AsyncStorage)
- No data sent to external services without consent
- All actions traceable and auditable

## Scalability Considerations

### Current Implementation
- In-memory state management
- Simulated services
- Local storage for persistence

### Production Enhancements
- Backend API for data persistence
- WebSocket for real-time updates
- Push notifications
- Offline support with sync
- Multi-language support
- Analytics and monitoring

## Agent Communication

Agents communicate through:
1. **Shared Context** - Family structure, user info
2. **Orchestrator** - Central coordination
3. **Store** - Shared state (widget states)
4. **Trace** - Shared audit trail

## Error Handling

- Agents handle errors gracefully
- Failed actions are logged
- User-friendly error messages
- Retry mechanisms for network operations

## Performance Optimizations

- Agents monitor on intervals (not continuous polling)
- Widget states cached and updated incrementally
- Chat messages limited to recent history
- Lazy loading for agent explanations

## Testing Strategy

### Unit Tests
- Agent logic
- Service functions
- Utility functions

### Integration Tests
- Agent orchestration
- Service interactions
- State management

### E2E Tests
- User flows
- Authentication
- Action execution

## Future Enhancements

1. **Real Service Integration**
   - Replace mocks with actual APIs
   - WebSocket connections
   - Push notifications

2. **Advanced AI**
   - Language model integration (GPT/Claude)
   - Natural language understanding
   - Predictive analytics

3. **Enhanced Features**
   - Multi-family support
   - Sharing and collaboration
   - Advanced analytics dashboard
   - Export and reporting

4. **Infrastructure**
   - Backend API
   - Database
   - Caching layer
   - CDN for assets
