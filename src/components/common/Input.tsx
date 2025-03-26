import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { InputProps } from '../../types/index';
import { Ionicons } from '@expo/vector-icons';

const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  const toggleSecureEntry = () => {
    setSecureTextEntry((prev: boolean) => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : {},
            inputStyle,
          ]}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#666"
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleSecureEntry}
          >
            <Ionicons
              name={secureTextEntry ? 'eye' : 'eye-off'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333',
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  iconContainer: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 14,
    marginTop: 4,
  },
});

export default Input; 