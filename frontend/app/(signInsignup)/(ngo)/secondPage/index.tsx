import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const Second = () => {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [pinCode, setPinCode] = useState("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  // Validation & Navigation
  const handleNext = async () => {
    const trimmedEmail = email.trim();
    const trimmedPhoneNo = phoneNo.trim();
    const trimmedPinCode = pinCode.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/; // Assumes a 10-digit phone number
    const pinCodeRegex = /^[0-9]+$/; // Assumes a any digit pin code

    if (!trimmedEmail || !trimmedPhoneNo || !trimmedPinCode) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(trimmedPhoneNo)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
      return;
    }

    if (!pinCodeRegex.test(trimmedPinCode)) {
      Alert.alert("Error", "Please enter a valid 6-digit pin code.");
      return;
    }

    // Navigate to the next page with validated data
    router.push({
      pathname: "/thirdpage",
      params: { email: trimmedEmail, phoneNo: trimmedPhoneNo, pinCode: trimmedPinCode },
    });
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, { backgroundColor: "transparent" }]} />
        <View style={[styles.progressDot, { backgroundColor: "#0D7C66" }]} />
        <View style={[styles.progressDot, { backgroundColor: "transparent" }]} />
      </View>

      {/* Input Fields */}
      <TextInputStyled
        ref={input1Ref}
        returnKeyType="next"
        text="E-mail"
        onChangeText={setEmail}
        value={email}
        placeholder="Enter E-mail"
        onSubmitEditing={() => input2Ref.current?.focus()}
      />
      <TextInputStyled
        ref={input2Ref}
        returnKeyType="next"
        text="Phone Number"
        onChangeText={setPhoneNo}
        value={phoneNo}
        placeholder="Enter the phone number"
        keyboardType="numeric"
        onSubmitEditing={() => input3Ref.current?.focus()}
      />
      <TextInputStyled
        ref={input3Ref}
        returnKeyType="done"
        text="Pin Code"
        onChangeText={setPinCode}
        value={pinCode}
        placeholder="Enter the pin code"
        keyboardType="numeric"
      />

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <ButtonSuccess
          style={styles.button}
          label="Back"
          onPress={() => router.push("/firstPage")}
        />
        <ButtonSuccess
          style={styles.button}
          label="Next"
          onPress={() => {
          /* router.navigate("/secondPage", { relativeToDirectory: true }); */
          handleNext();
        }}
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
    borderRadius: 15 / 2, // Fixed incorrect borderRadius
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    width: 100,
    height: 45,
  },
});

export default Second;
