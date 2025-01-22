import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";

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
    <View style={styles.container}>
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
  
    
        <ButtonSuccess
          label="SIGN UP"
          onPress={() => {
            router.navigate("/logIn", { relativeToDirectory: true });
          }}
        />
      
        <View style={{
          flexDirection:'row',
          marginTop: 10,
        }}>
        <Text style={{fontSize: 20,}}> Alredy Have An Account? </Text><ButtonText label="Login"  onPress={()=>{
          router.navigate("/logIn", { relativeToDirectory: true })
        }}/> 
        </View>
    </View>
  );
  
  return ui;

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#555",
  },
  
});

export default First;
