import ButtonGoogle from "@/components/button-google";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const FogetPassword = () => {
  const [email, setEmail] = useState("");
  const input1Ref = useRef<TextInput>(null);

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

  const ui = (
    <View
      style={styles.container}
    >
      <Text style={{ fontSize: 40, marginBottom: 20, fontWeight: "bold"}}>Forget Password</Text>
      <Text style={{ fontSize: 20, marginBottom: 60 }}>
        Enter Your Email Address To Reset Password
      </Text>
      <TextInputStyled
        ref={input1Ref}
        returnKeyType="next"
        text="E-mail"
        onSubmitEditing={() => {
          if (email == null || email === "") {
            markError(input1Ref);
            Alert.alert("Error", "Enter Email");
            input1Ref.current?.focus();
          } else {
            markOk(input1Ref);
          }
        }}
        onChangeText={setEmail}
        value={email}
        placeholder={"Enter E-mail"}
      />
      <ButtonSuccess
        label="NEXT"
        style={styles.button}
        onPress={() => {
          router.navigate("/resetPassword", { relativeToDirectory: true });
        }}
      />
    </View>
  );

  return ui;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
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
  button:{
    height:45,
    width:"50%",
  }
});
export default FogetPassword;