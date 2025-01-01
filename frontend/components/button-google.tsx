import { StyleSheet, View, Pressable, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  onPress?: () => void;
};

const ButtonGoogle = ({ onPress }: Props) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <FontAwesome name="google" size={30} color="black" />
        <Text style={styles.buttonLabel}>Continue with Google</Text>
      </Pressable>
    </View>
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
