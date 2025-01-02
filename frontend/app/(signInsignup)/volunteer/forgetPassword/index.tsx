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

  const ui = (
    <View
      style={{
        flex: 1,
        width: "100%",
        padding: 20,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 50, marginBottom: 10 }}>Foget Password</Text>
      <Text style={{ fontSize: 20, marginBottom: 60 }}>
        Enter Your Email Address To Reset Password
      </Text>
      <ButtonSuccess
        label="NEXT"
        onPress={() => {
          router.navigate("/resetPassword", { relativeToDirectory: true });
        }}
      />
    </View>
  );

  return ui;
};

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

  const updatedUI = (
    <View
      style={{
        flex: 1,
        width: "100%",
        padding: 20,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 50, marginBottom: 10 }}>Foget Password</Text>
      <Text style={{ fontSize: 20, marginBottom: 60 }}>
        Enter Your Email Address To Reset Password
      </Text>
      <TextInputStyled
        ref={input1Ref}
        returnKeyType="next"
        text="E-mail"
        onSubmitEditing={() => {
          if (email == null || email == "") {
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
        onPress={() => {
          router.navigate("/resetPassword", { relativeToDirectory: true });
        }}
      />
    </View>
  );

  const styles = StyleSheet.create({
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
  
export default FogetPassword;
