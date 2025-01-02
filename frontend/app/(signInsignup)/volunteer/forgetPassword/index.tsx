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

export default FogetPassword;
