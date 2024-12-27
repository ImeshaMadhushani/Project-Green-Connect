import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const ButtonText = ({ label, onPress, style }: Props) => {
  return (
    <View style={[styles.buttonContainer, style]}>
      <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
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
