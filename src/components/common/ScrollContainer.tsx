import React from 'react';
import { ScrollView, StyleSheet, View, StatusBar } from 'react-native';

interface ScrollContainerProps {
  children: React.ReactNode;
  style?: object;
  contentContainerStyle?: object;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ 
  children, 
  style, 
  contentContainerStyle 
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={true}
      scrollEventThrottle={16}
      bounces={true}
      overScrollMode="always"
    >
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.innerContainer}>
        {children}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default ScrollContainer; 