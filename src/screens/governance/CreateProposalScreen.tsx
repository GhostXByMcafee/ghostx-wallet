import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import useWalletStore from '../../store/useWalletStore';
import analyticsService from '../../services/analytics/analyticsService';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CreateProposal'>;

const CreateProposalScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { createProposal, isLoading, tokens } = useWalletStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });
  
  useEffect(() => {
    analyticsService.trackScreen('CreateProposalScreen');
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', description: '' };
    
    if (!title.trim()) {
      newErrors.title = 'The title is required';
      isValid = false;
    } else if (title.length < 5) {
      newErrors.title = 'The title must be at least 5 characters';
      isValid = false;
    }
    
    if (!description.trim()) {
      newErrors.description = 'The description is required';
      isValid = false;
    } else if (description.length < 20) {
      newErrors.description = 'The description must be at least 20 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const calculateVotingPower = () => {
    return tokens.reduce((total, token) => {
      return total + parseFloat(token.balance);
    }, 0).toFixed(2);
  };
  
  const hasSufficientPower = parseFloat(calculateVotingPower()) > 0;

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await createProposal(title, description);
      
      if (success) {
        analyticsService.trackEvent({
          name: 'proposal_created',
          properties: {
            titleLength: title.length,
            descriptionLength: description.length,
          },
        });
        
        Alert.alert(
          "Proposal created",
          "Your proposal has been created successfully and is available for voting.",
          [
            { text: "View proposals", onPress: () => navigation.goBack() }
          ]
        );
      } else {
        Alert.alert(
          "Error creating proposal",
          "An error occurred while creating the proposal. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An unexpected error occurred."
      );
    }
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Create new proposal</Text>
        <Text style={styles.subtitle}>
          Proposals allow token holders to decide the future of the platform.
        </Text>
      </View>

      <Card style={styles.powerCard}>
        <View style={styles.powerContainer}>
          <Text style={styles.powerLabel}>Your voting power</Text>
          <Text style={[
            styles.powerValue, 
            !hasSufficientPower && styles.insufficientPower
          ]}>
            {calculateVotingPower()}
          </Text>
        </View>
        
        {!hasSufficientPower && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={16} color="#FFD700" />
            <Text style={styles.warningText}>
              You need tokens to create proposals
            </Text>
          </View>
        )}
      </Card>

      <Card style={styles.formCard}>
        <Input
          label="Proposal title"
          placeholder="Ej. Update the consensus protocol"
          value={title}
          onChangeText={handleTitleChange}
          error={errors.title}
          maxLength={100}
        />
        
        <View style={styles.characterCount}>
          <Text style={styles.characterCountText}>
            {title.length}/100
          </Text>
        </View>
        
        <Input
          label="Detailed description"
          placeholder="Explain your proposal in detail, including its justification and specific changes you propose..."
          value={description}
          onChangeText={handleDescriptionChange}
          error={errors.description}
          multiline
          numberOfLines={6}
          style={styles.textArea}
        />
        
        <View style={styles.characterCount}>
          <Text style={styles.characterCountText}>
            {description.length}/1000
          </Text>
        </View>
        
        <Text style={styles.infoText}>
          Once created, the proposal will be open for voting for 7 days.
          Proposals cannot be edited after being created.
        </Text>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Create proposal"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading || !title || !description || !hasSufficientPower}
        />
        
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.cancelButton}
          disabled={isLoading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#BBBBBB',
    lineHeight: 22,
  },
  powerCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  powerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  powerLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  powerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  insufficientPower: {
    color: '#FF3B30',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 4,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FFD700',
  },
  formCard: {
    margin: 20,
    marginTop: 0,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 16,
  },
  characterCountText: {
    fontSize: 12,
    color: '#888888',
  },
  infoText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    margin: 20,
    marginTop: 8,
    marginBottom: 40,
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default CreateProposalScreen; 