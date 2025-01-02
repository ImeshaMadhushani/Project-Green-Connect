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
      <Text style={{ fontSize: 40, marginBottom: 60, fontWeight: "bold"}}>Welcome Back</Text>
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
      <View style={{width:"100%",alignItems:"flex-end"}}>
<<<<<<< Updated upstream
      <ButtonText label="Foget Password?" style={{
=======
      <ButtonText label="Forget Password?" style={{
>>>>>>> Stashed changes
        marginTop:5,
      }} onPress={() => {
        router.navigate("/forgetPassword", { relativeToDirectory: true });
      }} />
  </View>
      <ButtonSuccess
          label="Confirm"
          onPress={() => {
            router.navigate("/home", { relativeToDirectory: true });
          }}
        />

  <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 20,color:"gray"}}> Don't Have An Account? </Text>
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
