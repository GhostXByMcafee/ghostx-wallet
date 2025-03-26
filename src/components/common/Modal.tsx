import React from 'react';
import { Modal as RNModal, StyleSheet, Text, View } from 'react-native';
import Button from './Button';

interface ModalAction {
  text: string;
  variant?: 'primary' | 'outline' | 'secondary';
  onPress: () => void;
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actions: ModalAction[];
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  actions,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.actions}>
            {actions.map((action, index) => (
              <Button
                key={index}
                title={action.text}
                variant={action.variant || 'primary'}
                onPress={action.onPress}
                style={[
                  styles.actionButton,
                  index > 0 && styles.actionButtonMargin
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#333333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    minWidth: 100,
  },
  actionButtonMargin: {
    marginLeft: 12,
  },
});

export default Modal; 