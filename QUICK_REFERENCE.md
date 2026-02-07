# HAYAT Quick Reference

## Agent IDs

```typescript
'family_guardian'      // Family Guardian Agent
'residency_identity'   // Residency & Identity Agent
'compliance_sentinel'  // Compliance Sentinel Agent
'wellbeing'            // Family Well-Being Agent
```

## Agent Status Values

```typescript
'clear'                // Everything is compliant
'attention_needed'     // Action required
'action_in_progress'   // Action being executed
```

## Urgency Levels

```typescript
'low'      // Green - No immediate action
'medium'   // Yellow - Action needed soon
'high'     // Orange - Urgent action required
'critical' // Red - Immediate action required
```

## Common Patterns

### Adding a New Agent

1. Create agent class extending `BaseAgent`
2. Implement required methods:
   - `monitor()` - Check for issues
   - `evaluate()` - Generate actions
   - `act()` - Execute actions
3. Register in `App.tsx`:
   ```typescript
   const newAgent = new NewAgent();
   lyraOrchestrator.registerAgent(newAgent);
   ```

### Creating an Action

```typescript
const action: AgentAction = {
  id: this.generateActionId(),
  agentId: this.id,
  type: 'notification' | 'workflow_preparation' | 'payment_initiation' | 'renewal_start',
  description: 'User-friendly description',
  reason: 'Why this action is needed',
  priority: 0-100, // Higher = more urgent
  createdAt: new Date().toISOString(),
  status: 'pending',
};
```

### Creating a Trace Entry

```typescript
await this.createTrace(
  'action_type',
  'Reasoning for the action',
  { /* relevant data */ }
);
```

### Updating Widget State

```typescript
const widgetState = await agent.getWidgetState();
updateAgentWidgetState(agent.id, widgetState);
```

## Service Usage

### Lyra Orchestrator

```typescript
import {lyraOrchestrator} from '@services/lyra';

// Register agent
lyraOrchestrator.registerAgent(agent);

// Initialize all agents
await lyraOrchestrator.initializeAll();

// Start monitoring
lyraOrchestrator.startMonitoring(60000); // Every 60 seconds

// Get widget states
const states = await lyraOrchestrator.getWidgetStates();

// Execute action
await lyraOrchestrator.executeAction(actionId, agentId);
```

### Trace Service

```typescript
import {traceService} from '@services/trace';

// Create trace
const trace = await traceService.createTrace(
  agentId,
  action,
  reasoning,
  data,
  userId
);

// Get trace
const trace = await traceService.getTrace(agentId, actionId);

// Generate explanation
const explanation = traceService.generateExplanation(trace);
```

### UAE Pass Service

```typescript
import {uaePassService} from '@services/uae-pass';

// Authenticate
const user = await uaePassService.authenticate();

// Initiate payment
const result = await uaePassService.initiatePayment(
  amount,
  description,
  reference
);
```

### Crustdata Service

```typescript
import {crustdataService} from '@services/crustdata';

// Get visa expiries
const visas = await crustdataService.getVisaExpiries(memberIds);

// Subscribe to events
const unsubscribe = crustdataService.subscribeToEvents((event) => {
  // Handle event
});
```

### Uplift AI Service

```typescript
import {upliftAIService} from '@services/uplift';

// Evaluate risk
const assessment = await upliftAIService.evaluateRisk(
  'vaccination',
  daysUntilDue,
  memberRole,
  isMandatory
);

// Prioritize items
const prioritized = await upliftAIService.prioritizeItems(assessments);
```

## Store Usage

```typescript
import {useAppStore} from '@store/useAppStore';

// In component
const {chatMessages, agentWidgetStates, addChatMessage} = useAppStore();

// Add chat message
addChatMessage({
  id: 'msg_123',
  role: 'user' | 'assistant',
  content: 'Message text',
  timestamp: new Date().toISOString(),
  agentId: 'optional_agent_id',
});

// Update widget state
updateAgentWidgetState(agentId, widgetState);
```

## Component Props

### AgentWidget

```typescript
<AgentWidget
  widgetState={agentWidgetState}
  onPress={() => handleWidgetPress(agentId)}
/>
```

### Chatbot

```typescript
<Chatbot
  messages={chatMessages}
  onSendMessage={handleSendMessage}
  isLoading={isLoading}
/>
```

### ActionExplanationModal

```typescript
<ActionExplanationModal
  visible={showModal}
  action={selectedAction}
  explanation={explanation}
  onClose={() => setShowModal(false)}
/>
```

## Date Helpers

```typescript
import {formatDate, getDaysUntil, isOverdue, isUrgent} from '@utils/dateHelpers';

formatDate('2024-12-31'); // "Dec 31, 2024"
getDaysUntil('2024-12-31'); // 30 (if today is Dec 1)
isOverdue('2024-11-01'); // true
isUrgent('2024-12-15', 30); // true if within 30 days
```

## Constants

```typescript
import {AGENT_IDS, URGENCY_COLORS, STATUS_COLORS} from '@utils/constants';

AGENT_IDS.FAMILY_GUARDIAN
URGENCY_COLORS.critical // '#EF4444'
STATUS_COLORS.clear // '#10B981'
```

## Debugging Tips

1. **Check agent status:**
   ```typescript
   const state = await agent.getWidgetState();
   console.log(state);
   ```

2. **View traces:**
   ```typescript
   const traces = await traceService.getAgentTraces(agentId);
   console.log(traces);
   ```

3. **Monitor orchestrator:**
   ```typescript
   console.log(lyraOrchestrator.agents);
   ```

4. **Check store state:**
   ```typescript
   console.log(useAppStore.getState());
   ```
