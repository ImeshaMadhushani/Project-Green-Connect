import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import { useLocalSearchParams } from "expo-router";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const OTPPage = () => {
  /* const { email } = useLocalSearchParams();
  console.log("Email from params:", email); */

  const { email, userType } = useLocalSearchParams(); // Added userType
  console.log("Email from params:", email);
  console.log("User type from params:", userType); // Logging userType for debugging

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false); // Add loading state
  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleOtpChange = (index: number, value: string) => {
    value = value.trim(); // Trim spaces
    if (value.length <= 1) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Automatically move to the next input if not the last
      if (value && index < inputs.length - 1) {
        inputs[index + 1].current?.focus();
      }
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join(""); // Convert OTP array to string

    if (otp.some((digit) => digit === "")) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      console.log("Verifying OTP for email:", email);
      //console.log("API URL:", apiUrl);
      console.log("User Type:", userType);

      setLoading(true); // Set loading state
      let endpoint = "";
      if (userType === "organization") {
        endpoint = "/api/organization/verify-otp";
      } else if (userType === "admin") {
        endpoint = "/api/user/verify-otp";
      } else {
        endpoint = "/api/user/verify-otp";
      }

      console.log("API Endpoint:", endpoint);

      /*   const response = await axios.post(`${apiUrl}/api/user/verify-otp`, {
        email, // Send email and OTP to backend
        otp: otpCode,
      });
 */

      const response = await axios.post(`${apiUrl}${endpoint}`, {
        email, // Send email and OTP to backend
        otp: otpCode,
        userType,
      });

      if (response.status === 200) {
        Alert.alert("Success", "OTP verified successfully!");
        router.push({
          pathname: "/resetPassword",
          params: { email, otpCode, userType },
        }); // Navigate to reset password page
      }
    } catch (error: any) {
      console.error("OTP verification error:", error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to verify OTP."
      );
      setOtp(["", "", "", ""]); // Clear OTP inputs on failure
      inputs[0].current?.focus(); // Focus back on the first input
    }
  };

  /*   const markError = (inputRef) => {
    inputRef?.current?.setNativeProps({
      style: {
        borderColor: "tomato",
        borderWidth: 2,
      },
    });
  }; */

  /*   const handleInputFocus = (index) => {
    if (!otp[index]) {
      markError(inputs[index]);
    }
  }; */

  const ui = (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter OTP</Text>
      <Text style={styles.subheading}>
        Enter the 4-digit code sent to your email
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={inputs[index]}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleOtpChange(index, text)}
          />
        ))}
      </View>

      <ButtonSuccess label="VERIFY OTP" onPress={handleOtpSubmit} />
    </View>
  );

  return ui;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 40,
    color: "#555",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#7EB20B",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
  },
});

export default OTPPage;
