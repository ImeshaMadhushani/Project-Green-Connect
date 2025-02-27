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
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.button}>
        <FontAwesome name="google" size={28} color="#EA4335" />
        <Text style={styles.buttonLabel}>Continue with Google</Text>
      </Pressable>
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    height: 60,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
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
    paddingHorizontal: 10,
  },
  buttonLabel: {
    color: "#3C4043",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default ButtonGoogle;
