import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post(`${apiUrl}/api/user/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data; // Assuming backend returns token and user info
        await AsyncStorage.setItem("authToken", token);
        Alert.alert("Success", "Login successful");
        // Redirect based on user role
        if (user.role === "admin") {
          router.push("/(admin)/dashboard");
        } else {
          router.push("/home");
        }
      }
    } catch (error: any) {
      console.error(error.response?.data);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Something went wrong"
      );
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
      <View style={{ width: "100%", position: "relative" }}>
        <TextInputStyled
          ref={input2Ref}
          secureTextEntry={!showPassword}
          text="Password"
          onChangeText={setPassword}
          value={password}
          placeholder="Enter Password"
          style={{ flex: 1, paddingRight: 40 }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: "45%" }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <ButtonText
          label="Forgot Password?"
          style={{
            marginTop: 5,
          }}
          onPress={() => router.push("/forgetPassword")}
        />
      </View>

      <ButtonSuccess label="LOG IN" onPress={handleLogin} />

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 20, color: "gray" }}>
          {" "}
          Don't Have An Account?{" "}
        </Text>
        <ButtonText label="Signup" onPress={() => router.push("/signUp")} />
      </View>
    </View>
  );
};

export default LogIn;
