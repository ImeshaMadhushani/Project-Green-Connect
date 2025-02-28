import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { CheckBox } from "react-native-elements";

const Third = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const router = useRouter();

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return false;
    }

    if (password !== password2) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = () => {
    console.log("Submit button clicked!");

    if (!isChecked) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    if (validatePassword()) {
      console.log("Navigating to home...");
      router.push("/(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.activeDot]} />
      </View>

      {/* Input Fields */}
      <TextInputStyled
        ref={input2Ref}
        secureTextEntry={true}
        returnKeyType="next"
        text="Password"
        onChangeText={setPassword}
        value={password}
        placeholder="Enter password"
      />
      <TextInputStyled
        ref={input3Ref}
        secureTextEntry={true}
        returnKeyType="next"
        text="Confirm Password"
        onChangeText={setPassword2}
        value={password2}
        placeholder="Enter password"
      />

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Checkbox */}
      <CheckBox
        iconType="material-community"
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor="green"
        title="By signing up, you agree to our Terms & Conditions and Privacy Policy"
        checked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <ButtonSuccess
          style={styles.button}
          label="Back"
          onPress={() => router.push("/secondPage")}
        />
        <ButtonSuccess
          label="Finish"
          style={styles.button}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  button: {
    width: 100,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
});

export default Third;
