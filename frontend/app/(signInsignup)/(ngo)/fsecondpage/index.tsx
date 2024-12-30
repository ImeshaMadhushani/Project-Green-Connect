import ButtonGoogle from "@/components/button-google";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";
import { TextInput } from "react-native-gesture-handler";

const Second = () => {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [pinCode, setPinCode] = useState("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  return null;
};
const ui = (
    <View
      style={{
        flex: 1,
        width: "100%",
        padding: 20,
        alignItems: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: 10,
        }}
      >
        <View
          style={{
            width: 15,
            height: 15,
            borderColor: "#0D7C66",
            borderWidth: 2,
            borderRadius: "100%",
          }}
        />
        <View
          style={{
            width: 15,
            height: 15,
            borderColor: "#0D7C66",
            borderWidth: 2,
            borderRadius: "100%",
            backgroundColor: "#0D7C66",
          }}
        />
        <View
          style={{
            width: 15,
            height: 15,
            borderColor: "#0D7C66",
            borderWidth: 2,
            borderRadius: "100%",
          }}
        />
      </View>
    </View>
  );
  <TextInputStyled
  ref={input1Ref}
  returnKeyType="next"
  text="E-mail"
  onChangeText={setEmail}
  value={email}
  placeholder={"Enter E-mail"}
/>
<TextInputStyled
  ref={input2Ref}
  returnKeyType="next"
  text="Phone Number"
  onChangeText={setPhoneNo}
  value={phoneNo}
  placeholder={"Enter the phone number"}
/>
<TextInputStyled
  ref={input3Ref}
  returnKeyType="next"
  text="Pin Code"
  onChangeText={setPinCode}
  value={pinCode}
  placeholder={"Enter the pin code"}
/>
<View style={{ flex: 1, flexDirection: "row" }}>
  <ButtonSuccess
    style={{ width: 100 }}
    label="Back"
    onPress={() => {
      router.navigate("/firstPage", { relativeToDirectory: true });
    }}
  />
  <ButtonSuccess
    label="Next"
    style={{ width: 100 }}
    onPress={() => {
      router.navigate("/thirdPage", { relativeToDirectory: true });
    }}
  />
</View>
