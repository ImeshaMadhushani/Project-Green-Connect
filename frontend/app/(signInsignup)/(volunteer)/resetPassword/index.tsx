import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, View, StyleSheet} from "react-native";
import { TextInput } from "react-native-gesture-handler";

import axios from "axios";
import { useLocalSearchParams } from "expo-router"; 

const apiUrl = process.env.EXPO_PUBLIC_API_URL; 

const ResetPassword = () => {
  const { email, otpCode } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  /* const [otp, setOtp] = useState(""); // If OTP is required
  const [email, setEmail] = useState(""); // User's email
 */
  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);


  const markError = (inputRef: React.RefObject<TextInput>) => {
    inputRef.current?.setNativeProps({
      style: {
        borderColor: "tomato",
        borderWidth: 2,
      },
    });
  };
  const markOk = (inputRef: React.RefObject<TextInput>) => {
    inputRef.current?.setNativeProps({
      style: {
        borderColor: "green",
        borderWidth: 2,
      },
    });
  };

  const handleResetPassword = async () => {
    if (!password || !password2) {
      Alert.alert("Error", "Both password fields are required.");
      return;
    }

    if (password !== password2) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!email || !otpCode) {
      Alert.alert("Error", "Email and OTP are required.");
      return;
    }

    console.log("Resetting password with data: ", { email, otpCode, password });

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/user/reset-password`, {
        email, // Add email field
        otpCode, // If required
        password,
      });

      Alert.alert("Success", "Password reset successfully!");
      router.push("/logIn");
    } catch (error: any) {
      console.error(
        "Reset Password Error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInputStyled
        ref={input1Ref}
        password={true}
        returnKeyType="next"
        text="Password"
        onSubmitEditing={() => {
          if (password == null || password == "") {
            markError(input1Ref);
            Alert.alert("Error", "Enter Password");
            input2Ref.current?.focus();
          } else {
            markOk(input1Ref);
          }
        }}
        onChangeText={setPassword}
        value={password}
        placeholder={"Enter Password"}
      />
      <TextInputStyled
        ref={input2Ref}
        password={true}
        returnKeyType="next"
        text="Confirm Password"
        onSubmitEditing={() => {
          if (password2 == null || password2 == "") {
            markError(input2Ref);
            Alert.alert("Error", "Enter Password");
          } else {
            markOk(input2Ref);
          }
        }}
        onChangeText={setPassword2}
        value={password2}
        placeholder={"Enter Password"}
      />

      <ButtonSuccess
        label={loading ? "Processing..." : "Confirm"}
        onPress={handleResetPassword}
      />
      <View
        style={{
          flexDirection: "row",
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 60,
    alignSelf:"center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default ResetPassword;
