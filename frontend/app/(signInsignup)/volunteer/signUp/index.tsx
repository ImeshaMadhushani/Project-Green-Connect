import ButtonGoogle from "@/components/button-google";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";
import { TextInput } from "react-native-gesture-handler";

const SignUpState = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  return {
    email, setEmail, password, setPassword, password2, setPassword2, isChecked, setIsChecked, input1Ref, input2Ref, input3Ref
  };
};

export const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 16,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: "#ccc",
    },
    text: {
      marginHorizontal: 8,
      fontSize: 16,
      color: "#555",
    },
  });

export default SignUpState;
