/**
 * Agent Widget Component
 * Persistent widget showing agent status
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {AgentWidgetState, UrgencyLevel} from '../types/agent';

interface AgentWidgetProps {
  widgetState: AgentWidgetState;
  onPress: () => void;
}

export const AgentWidget: React.FC<AgentWidgetProps> = ({
  widgetState,
  onPress,
}) => {
  const getStatusColor = (status: string, urgency: UrgencyLevel): string => {
    if (status === 'clear') return '#10B981'; // Green
    if (status === 'action_in_progress') return '#3B82F6'; // Blue
    
    // Attention needed - color by urgency
    switch (urgency) {
      case 'critical':
        return '#EF4444'; // Red
      case 'high':
        return '#F59E0B'; // Orange
      case 'medium':
        return '#FBBF24'; // Yellow
      default:
        return '#6B7280'; // Gray
    }
  };

  const formatCountdown = (seconds?: number): string => {
    if (!seconds) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const statusColor = getStatusColor(widgetState.status, widgetState.urgency);

  return (
    <TouchableOpacity
      style={[styles.container, {borderLeftColor: statusColor}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.agentName}>{widgetState.agentName}</Text>
          <View style={[styles.statusIndicator, {backgroundColor: statusColor}]} />
        </View>
        
        {widgetState.status !== 'clear' && (
          <View style={styles.details}>
            {widgetState.message && (
              <Text style={styles.message} numberOfLines={2}>
                {widgetState.message}
              </Text>
            )}
            {widgetState.countdown !== undefined && (
              <View style={styles.countdownContainer}>
                <Text style={styles.countdown}>
                  {formatCountdown(widgetState.countdown)}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {widgetState.status === 'clear' && (
          <Text style={styles.clearMessage}>All clear</Text>
        )}
        
        {widgetState.status === 'action_in_progress' && (
          <ActivityIndicator size="small" color={statusColor} style={styles.loader} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  details: {
    marginTop: 4,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  countdownContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  countdown: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  clearMessage: {
    fontSize: 14,
    color: '#10B981',
    fontStyle: 'italic',
    marginTop: 4,
  },
  loader: {
    marginTop: 8,
  },
});
