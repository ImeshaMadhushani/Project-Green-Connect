import { StyleSheet, View, Pressable, Text, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRef } from "react";

type Props = {
  onPress?: () => void;
};

const ButtonGoogle = ({ onPress }: Props) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
        toValue: 0.95,
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
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }).start();
      };


  return (
    <Animated.View
      style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}
    >
      <Pressable style={styles.button} onPress={onPress}>
        <FontAwesome name="google" size={30} color="black" />
        <Text style={styles.buttonLabel}>Continue with Google</Text>
      </Pressable>
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  button: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flexDirection: "row",
    gap: 10,
  },
  buttonLabel: {
    color: "#3C4043",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ButtonGoogle;
