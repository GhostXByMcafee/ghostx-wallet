import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions
} from 'react-native';
import LottieView from 'lottie-react-native';

interface TransactionResultModalProps {
  visible: boolean;
  onClose: () => void;
  success: boolean;
  title: string;
  message: string;
  details?: string;
}

const TransactionResultModal: React.FC<TransactionResultModalProps> = ({
  visible,
  onClose,
  success,
  title,
  message,
  details
}) => {
  const [animation] = React.useState(new Animated.Value(0));
  const lottieRef = React.useRef<LottieView>(null);
  
  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
      
      if (lottieRef.current) {
        lottieRef.current.play();
      }
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0]
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY }], opacity }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.animation}>
              {success ? (
                <LottieView
                  ref={lottieRef}
                  source={require('../../../assets/success-animation.json')}
                  style={styles.animationView}
                  autoPlay
                  loop={false}
                />
              ) : (
                <LottieView
                  ref={lottieRef}
                  source={require('../../../assets/error-animation.json')}
                  style={styles.animationView}
                  autoPlay
                  loop={false}
                />
              )}
            </View>
            
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            {details && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Details:</Text>
                <Text style={styles.detailsText}>{details}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.button,
              success ? styles.successButton : styles.errorButton
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              {success ? 'Great!' : 'Try again'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  animation: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  animationView: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#AAAAAA',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#DDDDDD',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successButton: {
    backgroundColor: '#28A745',
  },
  errorButton: {
    backgroundColor: '#DC3545',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionResultModal; 