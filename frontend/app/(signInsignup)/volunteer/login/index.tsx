import React, { useRef, useState } from "react";
import { Alert, View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";

const LogIn: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const input1Ref = useRef<TextInput>(null);
    const input2Ref = useRef<TextInput>(null);

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

  return (
    <View style={{ flex: 1, width: "100%", padding: 20, alignItems: "center" }}>
    <Text style={{ fontSize: 50, marginBottom: 60 }}>Welcome Back</Text>
    <TextInputStyled
      ref={input1Ref}
      returnKeyType="next"
      text="E-mail"
      onSubmitEditing={() => {
        if (!email) {
          markError(input1Ref);
          Alert.alert("Error", "Enter Email");
          input1Ref.current?.focus();
        } else {
          markOk(input1Ref);
          input2Ref.current?.focus();
        }
      }}
      onChangeText={setEmail}
      value={email}
      placeholder={"Enter E-mail"}
    />
    <TextInputStyled
      ref={input2Ref}
      password={true}
      returnKeyType="next"
      text="Password"
      onSubmitEditing={() => {
        if (!password) {
          markError(input2Ref);
          Alert.alert("Error", "Enter Password");
          input2Ref.current?.focus();
        } else {
          markOk(input2Ref);
        }
      }}
      onChangeText={setPassword}
      value={password}
      placeholder={"Enter Password"}
    />
    </View>
  );
};

export default LogIn;
