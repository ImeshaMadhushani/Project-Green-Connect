import { useRef } from 'react';
import { StyleSheet, View, Pressable, Text, Animated } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
};

const Button = ({ label, onPress }: Props) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start(() => {
      if (onPress) {
        onPress();
      }
    });
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        
      >
        
      </Pressable>
    
  );
};

export default Button;
