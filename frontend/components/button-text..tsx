import { StyleSheet, View, Pressable, Text,Animated, StyleProp, ViewStyle } from "react-native";
import { useRef } from "react";

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const ButtonText = ({ label, onPress, style }: Props) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
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
    <Animated.View 
         style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }, style]}>
      <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {},
  button: {
    borderRadius: 10,
  },
  buttonLabel: {
    color: "#0D7C66",
    fontSize: 18,
  },
});

export default ButtonText;
