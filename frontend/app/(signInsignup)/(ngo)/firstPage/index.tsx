import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";

const First = () => {
  const [ngoname, setNgoname] = useState("");
  const [regNo, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  const handleNext = async () => {
    const trimmedNgoName = ngoname.trim();
    const trimmedRegNo = regNo.trim();
    const trimmedPassword = password.trim();
    const trimmedPassword2 = password2.trim();

    if (!trimmedNgoName || !trimmedRegNo || !trimmedPassword || !trimmedPassword2) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (!/[A-Z]/.test(trimmedPassword) || !/[a-z]/.test(trimmedPassword) || !/[0-9]/.test(trimmedPassword)) {
      Alert.alert("Error", "Password must contain at least one uppercase letter, one lowercase letter, and one number");
      return;
    }

    if (trimmedPassword !== trimmedPassword2) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    router.push({
      pathname: "/(tabs)/home",
      params: { ngoname: trimmedNgoName, regNo: trimmedRegNo },
    });
  };

  return (
    <View style={styles.container}>
    {/*   <View style={styles.stepContainer}>
        <View style={styles.stepCircleActive} />
        <View style={styles.stepCircle} />
        <View style={styles.stepCircle} />
      </View> */}
      <TextInputStyled
        ref={input1Ref}
        returnKeyType="next"
        text="Organization Name"
        onChangeText={setNgoname}
        value={ngoname}
        placeholder="Enter the name of your NGO"
      />
      <TextInputStyled
        ref={input2Ref}
        returnKeyType="next"
        text="Registration No"
        onChangeText={setRegno}
        value={regNo}
        placeholder="Enter the reg no"
      />
      <TextInputStyled
        ref={input3Ref}
        returnKeyType="next"
        text="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        placeholder="Enter your password"
      />
      <TextInputStyled
        returnKeyType="done"
        text="Confirm Password"
        secureTextEntry
        onChangeText={setPassword2}
        value={password2}
        placeholder="Confirm your password"
      />
      
      <Text style={styles.loginText}>
        Already have an account? <Text style={styles.loginLink} onPress={() => router.push("/(signInsignup)/(volunteer)/logIn")}>Login</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <ButtonSuccess
          style={styles.button}
          label="Back"
          onPress={() => router.navigate("/")}
        />
        <ButtonSuccess
          style={styles.button}
          label="Sign Up"
          onPress={handleNext}
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
    backgroundColor: "#F9F9F9",
  },
  stepContainer: {
    flexDirection: "row",
    gap: 10,
    margin: 10,
  },
  stepCircleActive: {
    width: 15,
    height: 15,
    borderColor: "#0D7C66",
    borderWidth: 2,
    borderRadius: 50,
    backgroundColor: "#0D7C66",
  },
  stepCircle: {
    width: 15,
    height: 15,
    borderColor: "#0D7C66",
    borderWidth: 2,
    borderRadius: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    width: 120,
    height: 50,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  loginLink: {
    color: "#0D7C66",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default First;