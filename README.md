# HAYAT - Family Government AI Advisor

HAYAT is a mobile-first application (iOS + Android) that serves as a family government advisor powered by AI agents for UAE residents. The app represents a family unit, not individuals, with a team of AI agents continuously monitoring government obligations and acting on behalf of the family.

## Core Concept

HAYAT provides:
- **One unified chatbot** for all interactions
- **Persistent agent widgets** showing real-time status even when all is clear
- **Silent operation** when compliant - only notifies when action is required
- **One-tap confirmations** for actions
- **Full explainability** - every action has a "Why am I seeing this?" explanation backed by Trace

## Architecture

### AI Agents

1. **Family Guardian Agent** (Orchestrator)
   - Maintains family structure (sponsor, spouse, children, domestic workers)
   - Understands dependencies between members
   - Decides when other agents should act
   - Powered by Lyra (multi-agent orchestration)

2. **Residency & Identity Agent**
   - Tracks visa expiry (ICP / GDRFA)
   - Monitors Emirates ID expiry
   - Tracks grace periods
   - Explains consequences differently for:
     - Tourist
     - Skilled expat
     - Domestic worker
   - Auto-prepares renewal workflows
   - All reasoning explainable and auditable via Trace

3. **Compliance Sentinel Agent**
   - Monitors parking fines (Dubai + Abu Dhabi only)
   - Tracks discount windows (24–48h)
   - Explains violation and consequences
   - Escalates tone if ignored:
     - Friendly → Urgent → Formal
   - Initiates payment via UAE Pass

4. **Family Well-Being Agent**
   - Tracks mandatory child vaccinations
   - Monitors medical fitness tests
   - Tracks insurance validity
   - Evaluates risk and urgency using Uplift AI
   - Prioritizes actions by stress, legal risk, and family impact

### Data & Signals

- Uses **Crustdata** to simulate real-time events:
  - Fines
  - Expiries
  - Grace period countdowns

### Security & Trust

- **UAE Pass authentication** for secure login
- Every agent action has a "Why am I seeing this?" explanation (Trace-backed)
- Full auditability of all agent decisions

## Project Structure

```
hayat/
├── src/
│   ├── agents/              # AI Agent implementations
│   │   ├── BaseAgent.ts
│   │   ├── FamilyGuardianAgent.ts
│   │   ├── ResidencyIdentityAgent.ts
│   │   ├── ComplianceSentinelAgent.ts
│   │   └── WellBeingAgent.ts
│   ├── components/          # React Native components
│   │   ├── AgentWidget.tsx
│   │   ├── Chatbot.tsx
│   │   └── ActionExplanationModal.tsx
│   ├── screens/             # App screens
│   │   ├── AuthScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── services/            # Core services
│   │   ├── lyra.ts          # Multi-agent orchestration
│   │   ├── trace.ts         # Explainability & auditability
│   │   ├── crustdata.ts     # Real-time event simulation
│   │   ├── uae-pass.ts      # UAE Pass authentication
│   │   ├── uplift.ts        # Risk assessment
│   │   └── chatbot.ts       # Chatbot service
│   ├── store/               # State management (Zustand)
│   │   └── useAppStore.ts
│   └── types/               # TypeScript type definitions
│       ├── index.ts
│       └── agent.ts
├── App.tsx                  # Main app component
├── index.js                 # Entry point
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native development environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and Android SDK

### Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS, install CocoaPods:
```bash
cd ios && pod install && cd ..
```

3. Start Metro bundler:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

5. Run on Android:
```bash
npm run android
```

## Key Features

### Agent Widgets

Each agent has a persistent widget showing:
- **Status**: Clear / Attention Needed / Action In Progress
- **Countdown timers** (if applicable)
- **Urgency level** (low, medium, high, critical)
- **Tap to see explanation or act**

Widgets are always visible, even when everything is compliant.

### Chatbot Interface

Single conversational interface for:
- Asking questions about family obligations
- Getting status updates
- Understanding agent actions
- Requesting explanations

### Explainability

Every agent action includes:
- **What**: Description of the action
- **Why**: Reasoning behind the action
- **Consequences**: What happens if ignored
- **Next steps**: What will happen next

All explanations are backed by Trace entries for full auditability.

## UX Principles

1. **Silent when compliant** - No notifications when everything is fine
2. **Notify only when action required** - Clear, actionable notifications
3. **One-tap confirmations** - Minimal friction for actions
4. **No browsing government services** - Agents handle everything
5. **No manual form filling** - Auto-prepared workflows
6. **Culturally appropriate tone** - Respectful, calm communication

## Technology Stack

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **React Navigation** - Navigation
- **Lyra** - Multi-agent orchestration (simulated)
- **Crustdata** - Real-time event simulation (simulated)
- **UAE Pass** - Authentication (simulated)
- **Trace** - Explainability and auditability
- **Uplift AI** - Risk assessment and prioritization

## Development Notes

### Simulated Services

The following services are currently simulated (mock implementations):
- Lyra SDK - Multi-agent orchestration
- Crustdata SDK - Real-time event simulation
- UAE Pass SDK - Authentication and payment
- Trace Service - Explainability (in-memory storage)

In production, these would connect to actual APIs and services.

### Agent Monitoring

Agents monitor continuously (every 60 seconds by default) and update widget states in real-time. The Family Guardian Agent coordinates all other agents.

### State Management

The app uses Zustand for state management, storing:
- Authentication state
- Chat messages
- Agent widget states

## Future Enhancements

- Backend API integration
- Real-time WebSocket connections
- Push notifications
- Offline support
- Multi-language support (Arabic, English)
- Advanced AI language model integration
- Analytics and insights dashboard

## License

This project is part of the c0mpiled hackathon solution.

## Contributing

This is a hackathon project. For production use, additional security, testing, and infrastructure considerations would be required.
