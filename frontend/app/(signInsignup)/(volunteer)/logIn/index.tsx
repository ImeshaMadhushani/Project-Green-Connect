import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";

const LogIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);

  const validateInputs = () => {
    if (!email.trim()) {
      markError(input1Ref);
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      markError(input1Ref);
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    markOk(input1Ref);

    if (!password.trim()) {
      markError(input2Ref);
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    if (password.length < 6) {
      markError(input2Ref);
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    markOk(input2Ref);

    return true;
  };

  const markError = (inputRef: React.RefObject<TextInput>) => {
    inputRef.current?.setNativeProps({
      style: { borderColor: "tomato", borderWidth: 2 },
    });
  };

  const markOk = (inputRef: React.RefObject<TextInput>) => {
    inputRef.current?.setNativeProps({
      style: { borderColor: "green", borderWidth: 2 },
    });
  };

  const handleLogin = () => {
    if (validateInputs()) {
      router.navigate("/home", { relativeToDirectory: true });
    }
  };

  return (
    <View style={{ flex: 1, width: "100%", padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 40, marginBottom: 60, fontWeight: "bold" }}>
        Welcome Back
      </Text>
      <TextInputStyled
        ref={input1Ref}
        returnKeyType="next"
        text="E-mail"
        onChangeText={setEmail}
        value={email}
        placeholder="Enter E-mail"
      />
      <TextInputStyled
        ref={input2Ref}
        secureTextEntry
        returnKeyType="done"
        text="Password"
        onChangeText={setPassword}
        value={password}
        placeholder="Enter Password"
      />
      <View style={{ width: "100%", alignItems: "center" }}>
        <ButtonText
          label="Forgot Password?"
          style={{
            marginTop: 5,
          }}
          onPress={() => {
            router.navigate("/forgetPassword", { relativeToDirectory: true });
          }}
        />
      </View>

      <ButtonSuccess
        label="LOG IN"
        onPress={() => {
          router.navigate("/home", { relativeToDirectory: true });
        }}
      />

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 20, color: "gray" }}>
          {" "}
          Don't Have An Account?{" "}
        </Text>
        <ButtonText
          label="Signup"
          onPress={() => {
            router.navigate("/signUp", { relativeToDirectory: true });
          }}
        />
      </View>
    </View>
  );
};

export default LogIn;
