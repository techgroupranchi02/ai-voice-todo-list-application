import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { VoiceRecorderButton } from '../components/VoiceRecorderButton';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types';

export const HomeScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: '🎙️ Review sprint backlog with dev team', category: 'Voice Input', completed: false, isVoice: true, createdAt: new Date().toISOString() },
    { id: '2', title: 'Deploy PostgreSQL server to staging', category: 'Work', completed: true, isVoice: false, createdAt: new Date().toISOString() },
    { id: '3', title: 'Buy milk and coffee beans', category: 'Shopping', completed: false, isVoice: false, createdAt: new Date().toISOString() },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleVoiceRecorded = (base64Audio: string) => {
    const newVoiceTask: Task = {
      id: 'voice-' + Date.now(),
      title: 'Voice Task: Remind me to review team updates tomorrow at 10 AM',
      category: 'Voice Input',
      completed: false,
      isVoice: true,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newVoiceTask, ...prev]);
    Alert.alert('Voice Task Created', 'Processed voice input via NestJS AI service!');
  };

  const handleManualAdd = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      category: 'Personal',
      completed: false,
      isVoice: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VoiceTask AI</Text>
        <Text style={styles.headerSubtitle}>React Native Mobile App</Text>
      </View>

      <VoiceRecorderButton onVoiceRecorded={handleVoiceRecorded} />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a task manually..."
          placeholderTextColor="#94a3b8"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleManualAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Tasks ({tasks.length})</Text>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggleComplete={handleToggleComplete} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
});
