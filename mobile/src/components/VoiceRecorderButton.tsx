import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
  onVoiceRecorded: (base64Audio: string) => void;
}

export const VoiceRecorderButton: React.FC<Props> = ({ onVoiceRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePress = async () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onVoiceRecorded('data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQAC...demo');
      }, 1200);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={handlePress}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#ffffff" size="large" />
        ) : (
          <Text style={styles.icon}>{isRecording ? '⏹️' : '🎙️'}</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.statusText}>
        {isProcessing
          ? 'AI Processing Voice Task...'
          : isRecording
          ? '🔴 Recording... Tap to Stop'
          : 'Tap Mic to Speak Task'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  recordingButton: {
    backgroundColor: '#ef4444',
  },
  icon: {
    fontSize: 34,
  },
  statusText: {
    marginTop: 12,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
});
