import { useState } from "react";
import { TextInput } from "react-native";
import { Alert } from "react-native";
import { Text, View, StyleSheet } from "react-native";

const ResetPassword = () => {

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);

  const markError = (inputRef) => {
    inputRef.current?.setNativeProps({
      style: { borderColor: "red", borderWidth: 2 },
    });
  };
  
  const markOk = (inputRef) => {
    inputRef.current?.setNativeProps({
      style: { borderColor: "green", borderWidth: 2 },
    });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        ref={input1Ref}
        password={true}
        returnKeyType="next"
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
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
      />
      <TextInput
        ref={input2Ref}
        style={styles.input}
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
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setPassword2}
        value={password2}
      />
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
