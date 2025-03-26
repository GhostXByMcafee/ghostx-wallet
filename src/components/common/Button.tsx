import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  ...rest
}) => {
  const getButtonStyle = () => {
    let baseStyle: ViewStyle = {...styles.button};
    
    switch (variant) {
      case 'primary':
        baseStyle = {...baseStyle, ...styles.primaryButton};
        break;
      case 'secondary':
        baseStyle = {...baseStyle, ...styles.secondaryButton};
        break;
      case 'outline':
        baseStyle = {...baseStyle, ...styles.outlineButton};
        break;
      case 'text':
        baseStyle = {...baseStyle, ...styles.textButton};
        break;
    }
    
    switch (size) {
      case 'small':
        baseStyle = {...baseStyle, ...styles.smallButton};
        break;
      case 'medium':
        baseStyle = {...baseStyle, ...styles.mediumButton};
        break;
      case 'large':
        baseStyle = {...baseStyle, ...styles.largeButton};
        break;
    }
    
    if (fullWidth) {
      baseStyle = {...baseStyle, ...styles.fullWidth};
    }
    
    if (disabled || loading) {
      baseStyle = {...baseStyle, ...styles.disabledButton};
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    let baseStyle: TextStyle = {...styles.buttonText};
    
    switch (variant) {
      case 'primary':
        baseStyle = {...baseStyle, ...styles.primaryText};
        break;
      case 'secondary':
        baseStyle = {...baseStyle, ...styles.secondaryText};
        break;
      case 'outline':
        baseStyle = {...baseStyle, ...styles.outlineText};
        break;
      case 'text':
        baseStyle = {...baseStyle, ...styles.textButtonText};
        break;
    }
    
    switch (size) {
      case 'small':
        baseStyle = {...baseStyle, ...styles.smallText};
        break;
      case 'medium':
        baseStyle = {...baseStyle, ...styles.mediumText};
        break;
      case 'large':
        baseStyle = {...baseStyle, ...styles.largeText};
        break;
    }
    
    if (disabled || loading) {
      baseStyle = {...baseStyle, ...styles.disabledText};
    }
    
    return baseStyle;
  };
  
  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[getButtonStyle(), style]}
      activeOpacity={disabled || loading ? 1 : 0.7}
      disabled={disabled || loading}
      {...rest}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'text' ? '#3366FF' : '#FFFFFF'} 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View style={styles.leftIcon}>{icon}</View>}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            {icon && iconPosition === 'right' && <View style={styles.rightIcon}>{icon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#3366FF',
  },
  secondaryButton: {
    backgroundColor: '#2A2A2A',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3366FF',
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#3366FF',
  },
  textButtonText: {
    color: '#3366FF',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button; 