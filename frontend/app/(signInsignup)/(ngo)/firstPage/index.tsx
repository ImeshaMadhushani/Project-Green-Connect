import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import ButtonSuccess from "@/components/button-success";
import FileInput from "@/components/FileInput";

const First = () => {
  // const [ngoname, setNgoname] = useState("");
  // const [uniqueId, setUniqueId] = useState("");
  const [regNo, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  const ui = (
    <View
      style={styles.container}
    >
      {/* <TextInputStyled
          ref={input1Ref}
          returnKeyType="next"
          text="Organization Name"
          onChangeText={setNgoname}
          value={ngoname}
          placeholder={"Enter the name of your NGO"}
        />
      <TextInputStyled
        ref={input2Ref}
        returnKeyType="next"
        text="Registration No"
        onChangeText={setUniqueId}
        value={uniqueId}
        placeholder={"Enter the reg no"}
      /> */}
      <TextInputStyled
        ref={input1Ref}
        returnKeyType="done"
        text="Registration Date"
        onChangeText={setRegno}
        value={regNo}
        placeholder="Enter the reg date"
      />
       <TextInputStyled
        ref={input2Ref}
        password={true}
        returnKeyType="next"
        text="Password"
        onChangeText={setPassword}
        value={password}
        placeholder={"Enter password"}
      />
      <TextInputStyled
        ref={input3Ref}
        password={true}
        returnKeyType="next"
        text="Confirm Password"
        onChangeText={setPassword2}
        value={password2}
        placeholder={"Enter password"}
      />
  
      <View style={{ flex: 1, flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          width: "100%", }}>
        <ButtonSuccess
          style={{ width: 100, height: 45,}}
          label="Back"
          onPress={() => {
            router.navigate("/", { relativeToDirectory: true });
          }}
        />
      <ButtonSuccess
        label="Next"
        style={{ width: 100, height: 45,}}
        onPress={() => {
          router.navigate("/logIn", { relativeToDirectory: true });
        }}
      />
    </View>
    </View>
  );
  
  return ui;

};

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

export default First;
