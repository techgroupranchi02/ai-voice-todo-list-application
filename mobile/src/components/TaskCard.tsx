import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';

interface Props {
  task: Task;
  onToggleComplete: (id: string) => void;
}

export const TaskCard: React.FC<Props> = ({ task, onToggleComplete }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onToggleComplete(task.id)} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>
      </TouchableOpacity>

      <View style={styles.badgeRow}>
        {task.isVoice && (
          <View style={[styles.badge, styles.voiceBadge]}>
            <Text style={styles.voiceText}>🎙️ Voice</Text>
          </View>
        )}
        <View style={[styles.badge, styles.categoryBadge]}>
          <Text style={styles.categoryText}>{task.category || 'General'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#8b5cf6',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '600',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  voiceBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  categoryBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
  },
  voiceText: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryText: {
    color: '#a5f3fc',
    fontSize: 12,
    fontWeight: '600',
  },
});
