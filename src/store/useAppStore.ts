/**
 * Zustand Store for App State
 */

import {create} from 'zustand';
import {ChatMessage, AgentWidgetState} from '../types';
import {AgentWidgetState as AgentState} from '../types/agent';

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  currentUser: any | null;
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Agent Widgets
  agentWidgetStates: Map<string, AgentState>;
  
  // Actions
  setAuthenticated: (authenticated: boolean, user?: any) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateAgentWidgetState: (agentId: string, state: AgentState) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  chatMessages: [],
  agentWidgetStates: new Map(),

  setAuthenticated: (authenticated, user) =>
    set({isAuthenticated: authenticated, currentUser: user}),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  updateAgentWidgetState: (agentId, state) =>
    set((currentState) => {
      const newStates = new Map(currentState.agentWidgetStates);
      newStates.set(agentId, state);
      return {agentWidgetStates: newStates};
    }),

  clearChat: () => set({chatMessages: []}),
}));
