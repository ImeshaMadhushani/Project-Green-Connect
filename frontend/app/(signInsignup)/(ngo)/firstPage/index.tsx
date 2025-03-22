import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";

import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "react-native-paper";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const First = () => {
  const [name, setNgoname] = useState("");
  const [username, setUsername] = useState("");
  const [registrationNumber, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [legalDocument, setLegalDocument] = useState<{ uri: string; name?: string }>({ uri: "", name: "" });
  const [role] = useState("organization");


  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  // Function to pick a file
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Adjust MIME type if needed
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const { uri, name } = result.assets[0];
      setLegalDocument({ uri, name });
    } catch (error) {
      console.error("File Selection Error:", error);
      Alert.alert("Error", "Failed to pick a document");
    }
  };

  const handleNext = async () => {
    const trimmedNgoName = name.trim();
    const trimmedRegNo = registrationNumber.trim();
    const trimmedPassword = password.trim();
    const trimmedPassword2 = password2.trim();
    const trimmedEmail = email.trim();
    const trimmedRegistrationDate = registrationDate.trim();

    if (
      !trimmedNgoName ||
      !trimmedRegNo ||
      !trimmedPassword ||
      !trimmedPassword2 ||
      !trimmedEmail ||
      !trimmedRegistrationDate ||
      !legalDocument
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (
      !/[A-Z]/.test(trimmedPassword) ||
      !/[a-z]/.test(trimmedPassword) ||
      !/[0-9]/.test(trimmedPassword)
    ) {
      Alert.alert(
        "Error",
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return;
    }

    if (trimmedPassword !== trimmedPassword2) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("registrationNumber", registrationNumber);
    formData.append("registrationDate", registrationDate);
    formData.append("legalDocument", {
      uri: legalDocument.uri,
      type: "application/pdf", // Adjust the MIME type if necessary
      name: legalDocument.name || "document.pdf",
    } as any);
    formData.append("role", "organization"); // Fixed role

    console.log("SignUp Payload:", formData);

    try {
      await axios.post(`${apiUrl}/api/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert(
        "Success",
        "Account created successfully! Awaiting admin approval."
      );
      router.push("/logIn");
    } catch (error: any) {
      console.error("SignUp Error: ", error.response?.data || error.message);
      Alert.alert(
        "Sign Up Failed",
        error.response?.data?.message || "Network error"
      );
    }
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
        value={name}
        placeholder="Enter the name of your NGO"
      />
      <TextInputStyled
        text="Username"
        onChangeText={setUsername}
        value={username}
        placeholder="Enter Your Username"
      />
      <TextInputStyled
        ref={input2Ref}
        returnKeyType="next"
        text="Registration No"
        onChangeText={setRegno}
        value={registrationNumber}
        placeholder="Enter the reg no"
      />
      <TextInputStyled
        returnKeyType="next"
        text="Email"
        onChangeText={setEmail}
        value={email}
        placeholder="Enter your email"
        keyboardType="email-address"
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
      <TextInputStyled
        returnKeyType="next"
        text="Registration Date"
        onChangeText={setRegistrationDate}
        value={registrationDate}
        placeholder="Enter the registration date"
      />
      <View style={{ width: "100%", marginTop: 10 }}>
        <Button mode="contained" onPress={pickDocument}>
          Upload Legal Document
        </Button>
        {legalDocument.uri ? (
          <Text style={{ marginTop: 10 }}>
            Selected File: {legalDocument.name}
          </Text>
        ) : (
          <Text style={{ marginTop: 10, color: "gray" }}>No file selected</Text>
        )}
      </View>

      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => router.push("/(signInsignup)/(volunteer)/logIn")}
        >
          Login
        </Text>
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