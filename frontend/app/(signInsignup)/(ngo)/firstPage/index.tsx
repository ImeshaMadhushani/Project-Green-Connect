import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";

const First = () => {
  const [ngoname, setNgoname] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [type, setType] = useState("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

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
      <TextInputStyled
  ref={input1Ref}
  returnKeyType="next"
  text="NGO NAME"
  onChangeText={setNgoname}
  value={ngoname}
  placeholder={"Enter the name of your NGO"}
/>
<TextInputStyled
  ref={input2Ref}
  returnKeyType="next"
  text="Uniqur ID"
  onChangeText={setUniqueId}
  value={uniqueId}
  placeholder={"Enter the id"}
/>
<TextInputStyled
  ref={input3Ref}
  returnKeyType="next"
  text="Type"
  onChangeText={setType}
  value={type}
  placeholder={"Enter type of your NGO"}
/>

    </View>
  );
  
  return ui;
  


};

export default First;
