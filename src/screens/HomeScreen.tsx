/**
 * Home Screen
 * Main screen with agent widgets and chatbot
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {AgentWidget} from '../components/AgentWidget';
import {Chatbot} from '../components/Chatbot';
import {ActionExplanationModal} from '../components/ActionExplanationModal';
import {useAppStore} from '../store/useAppStore';
import {lyraOrchestrator} from '../services/lyra';
import {chatbotService} from '../services/chatbot';
import {ChatMessage, AgentAction} from '../types';

export const HomeScreen: React.FC = () => {
  const {
    chatMessages,
    agentWidgetStates,
    addChatMessage,
    updateAgentWidgetState,
  } = useAppStore();

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize agents and start monitoring
  useEffect(() => {
    initializeAgents();
    return () => {
      lyraOrchestrator.cleanup();
    };
  }, []);

  // Update widget states periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateWidgetStates();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const initializeAgents = async () => {
    try {
      await lyraOrchestrator.initializeAll();
      lyraOrchestrator.startMonitoring(60000); // Monitor every minute
      await updateWidgetStates();
    } catch (error) {
      console.error('Error initializing agents:', error);
    }
  };

  const updateWidgetStates = async () => {
    try {
      const states = await lyraOrchestrator.getWidgetStates();
      states.forEach((state, agentId) => {
        updateAgentWidgetState(agentId, state);
      });
    } catch (error) {
      console.error('Error updating widget states:', error);
    }
  };

  const handleWidgetPress = async (agentId: string) => {
    const widgetState = agentWidgetStates.get(agentId);
    if (!widgetState || widgetState.status === 'clear') {
      return;
    }

    // Show explanation for the first action
    if (widgetState.actions && widgetState.actions.length > 0) {
      const action = widgetState.actions[0];
      setSelectedAction(action);
      setSelectedAgentId(agentId);
      
      try {
        const agent = (lyraOrchestrator as any).agents.get(agentId);
        if (agent) {
          const explanationText = await agent.explain(action.id);
          setExplanation(explanationText);
          setShowExplanationModal(true);
        }
      } catch (error) {
        console.error('Error getting explanation:', error);
        setExplanation(action.reason || 'No explanation available');
        setShowExplanationModal(true);
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMessage);

    setIsLoading(true);

    try {
      // Process message
      const response = await chatbotService.processMessage(
        message,
        'user_1', // Would use actual user ID
      );
      addChatMessage(response);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        agentId: 'family_guardian',
      };
      addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionConfirm = async () => {
    if (!selectedAction || !selectedAgentId) return;

    try {
      const success = await lyraOrchestrator.executeAction(
        selectedAction.id,
        selectedAgentId,
      );
      
      if (success) {
        // Update widget states
        await updateWidgetStates();
        
        // Add confirmation message
        const confirmation: ChatMessage = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `Action completed: ${selectedAction.description}`,
          timestamp: new Date().toISOString(),
          agentId: selectedAgentId,
        };
        addChatMessage(confirmation);
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }

    setShowExplanationModal(false);
    setSelectedAction(null);
    setSelectedAgentId(null);
  };

  const agentWidgets = Array.from(agentWidgetStates.entries()).map(([id, state]) => (
    <AgentWidget
      key={id}
      widgetState={state}
      onPress={() => handleWidgetPress(id)}
    />
  ));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.widgetsContainer}>
          <Text style={styles.sectionTitle}>Family Status</Text>
          {agentWidgets.length > 0 ? (
            agentWidgets
          ) : (
            <View style={styles.emptyWidgets}>
              <Text style={styles.emptyText}>Loading agent status...</Text>
            </View>
          )}
        </View>

        <View style={styles.chatContainer}>
          <Chatbot
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>

      <ActionExplanationModal
        visible={showExplanationModal}
        action={selectedAction}
        explanation={explanation}
        onClose={() => {
          setShowExplanationModal(false);
          setSelectedAction(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  widgetsContainer: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyWidgets: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  chatContainer: {
    height: 400, // Fixed height for chat
    marginTop: 20,
  },
});
