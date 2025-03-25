import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

let logMessages: {type: 'log' | 'warn' | 'error', message: string}[] = [];

const MAX_LOGS = 50;

console.log = (...args) => {
  originalConsoleLog(...args);
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  
  logMessages.push({type: 'log', message});
  if (logMessages.length > MAX_LOGS) {
    logMessages.shift();
  }
};

console.warn = (...args) => {
  originalConsoleWarn(...args);
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  
  logMessages.push({type: 'warn', message});
  if (logMessages.length > MAX_LOGS) {
    logMessages.shift();
  }
};

console.error = (...args) => {
  originalConsoleError(...args);
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  
  logMessages.push({type: 'error', message});
  if (logMessages.length > MAX_LOGS) {
    logMessages.shift();
  }
};

const DebugConsole: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<typeof logMessages>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...logMessages]);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!visible) {
    return (
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.toggleButtonText}>Debug</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Debug Console</Text>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text 
            key={index} 
            style={[
              styles.logEntry,
              log.type === 'warn' ? styles.warnLog : null,
              log.type === 'error' ? styles.errorLog : null
            ]}
          >
            {log.message}
          </Text>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => {
            logMessages = [];
            setLogs([]);
          }}
        >
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#333',
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#FFF',
    fontSize: 24,
    padding: 4,
  },
  logContainer: {
    flex: 1,
    padding: 8,
  },
  logEntry: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  warnLog: {
    color: '#FFFF00',
  },
  errorLog: {
    color: '#FF6666',
  },
  footer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  clearButton: {
    padding: 8,
    backgroundColor: '#555',
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#FFF',
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 9999,
  },
  toggleButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
});

export default DebugConsole; 