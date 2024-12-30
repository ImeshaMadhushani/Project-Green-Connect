import ButtonGoogle from "@/components/button-google"; // Unused import
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text"; // Unused import
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";
import { TextInput } from "react-native-gesture-handler"; // Ensure correct import

const Third = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  const ui = (
    <View style={styles.container}>
      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.activeDot]} />
      </View>
      {/* Input Fields */}
      <TextInputStyled
        ref={input1Ref}
        returnKeyType="next"
        text="E-mail"
        onChangeText={setEmail}
        value={email}
        placeholder={"Enter E-mail"}
      />
      <TextInputStyled
        ref={input2Ref}
        password={true}
        returnKeyType="next"
        text="Password"
        onChangeText={setPassword}
        value={password}
        placeholder={"Enter password"}
      />
      <TextInputStyled
        ref={input3Ref}
        password={true}
        returnKeyType="next"
        text="Confirm Password"
        onChangeText={setPassword2}
        value={password2}
        placeholder={"Enter password"}
      />
      {/* Checkbox */}
      <CheckBox
        iconType="material-community"
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor="green"
        title="by Signing up you agree to our terms & conditions of use and privacy policy"
        checked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
      />
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <ButtonSuccess
          style={styles.button}
          label="Back"
          onPress={() => {
            router.navigate("/secondPage", { relativeToDirectory: true });
          }}
        />
        <ButtonSuccess
          label="Finish"
          style={styles.button}
          onPress={() => {
            router.navigate("/home", { relativeToDirectory: true });
          }}
        />
      </View>
    </View>
  );

  return ui; // Return the UI
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  progressContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    margin: 10,
  },
  progressDot: {
    width: 15,
    height: 15,
    borderColor: "#0D7C66",
    borderWidth: 2,
    borderRadius: 100,
  },
  activeDot: {
    backgroundColor: "#0D7C66",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
  button: {
    width: 100,
  },
});

export default Third;