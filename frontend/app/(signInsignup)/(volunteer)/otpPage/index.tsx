import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useState, useRef } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const handleOtpChange = (index, value) => {
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

  const handleOtpSubmit = () => {
    if (otp.some((digit) => digit === "")) {
      Alert.alert("Error", "Please fill all fields.");
    } else {
      Alert.alert("Success", `Your OTP is: ${otp.join("")}`);
      router.navigate("/resetPassword", { relativeToDirectory: true });
    }
  };

  const markError = (inputRef) => {
    inputRef?.current?.setNativeProps({
      style: {
        borderColor: "tomato",
        borderWidth: 2,
      },
    });
  };

  const handleInputFocus = (index) => {
    if (!otp[index]) {
      markError(inputs[index]);
    }
  };

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
            value={value}
            onChangeText={(text) => handleOtpChange(index, text)}
            onFocus={() => handleInputFocus(index)}
          />
        ))}
      </View>

      <ButtonSuccess
        label="VERIFY OTP"
        onPress={handleOtpSubmit}
      />
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
