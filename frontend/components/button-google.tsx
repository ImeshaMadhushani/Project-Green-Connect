import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
  onPress?: () => void;
};

const ButtonGoogle = ({ onPress }: Props) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
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
  },
  buttonLabel: {
    color: "#3C4043",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ButtonGoogle;
