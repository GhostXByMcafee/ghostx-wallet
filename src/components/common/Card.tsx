import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CardProps } from '../../types/index';

const Card: React.FC<CardProps> = ({
  children,
  title,
  style,
  titleStyle,
  contentStyle,
  onPress,
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  content: {
    width: '100%',
  },
});

export default Card; 