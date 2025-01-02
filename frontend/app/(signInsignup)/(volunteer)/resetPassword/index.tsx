import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const ResetPassword = () => {

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

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
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
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
