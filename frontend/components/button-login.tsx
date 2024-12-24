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
    <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
      >
       <Text style={styles.buttonLabel}>{label}</Text> 
      </Pressable>
      </Animated.View>
  );
};
const styles = StyleSheet.create({
    buttonContainer: {
      width: 280,
      height: 68,
      marginHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 25,
    },
    button: {
      borderRadius: 10,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: "#ffffff70",
    },
    buttonLabel: {
      color: 'white',
      fontSize: 20,
    },
  });
  

export default Button;
