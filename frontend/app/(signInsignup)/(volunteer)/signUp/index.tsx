import ButtonGoogle from "@/components/button-google";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import PhotoUploadStyled from "@/components/PhotoUpload";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

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
      style={{
        flex: 1,
        width: "100%",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PhotoUploadStyled
        label="Profile Photo"
        onImageSelect={setProfilePhoto}
      />

<TextInputStyled
        ref={input1Ref}
        returnKeyType="next"
        text="Name"
        onSubmitEditing={() => {
          if (name == null || name == "") {
            markError(input1Ref);
            Alert.alert("Error", "Please Enter Your Name");
            input1Ref.current?.focus();
          } else {
            markOk(input1Ref);
            input2Ref.current?.focus();
          }
        }}
        onChangeText={setName}
        value={name}
        placeholder={"Enter Your Name"}
      />
      <TextInputStyled
        ref={input1Ref}
        returnKeyType="next"
        text="UserName"
        onSubmitEditing={() => {
          if (username == null || username == "") {
            markError(input1Ref);
            Alert.alert("Error", "Please Enter A UserName");
            input1Ref.current?.focus();
          } else {
            markOk(input1Ref);
            input2Ref.current?.focus();
          }
        }}
        onChangeText={setUsername}
        value={username}
        placeholder={"Enter Your Username"}
      />
      
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
          if (password == null || password == "") {
            markError(input2Ref);
            Alert.alert("Error", "Enter Password");
            input2Ref.current?.focus();
          } else {
            markOk(input2Ref);
            input3Ref.current?.focus();
          }
        }}
        onChangeText={setPassword}
        value={password}
        placeholder={"Enter Password"}
      />
      <TextInputStyled
        password={true}
        ref={input3Ref}
        text="Confirm Password"
        returnKeyType="next"
        onSubmitEditing={() => {
          if (password2 == null || password2 == "") {
            markError(input3Ref);
            Alert.alert("Error", "Enter Password");
            input3Ref.current?.focus();
          } else {
            markOk(input3Ref);
          }
        }}
        onChangeText={setPassword2}
        value={password2}
        placeholder={"Enter Password"}
      />
      
      <ButtonSuccess
        label="SIGN UP"
        onPress={() => {
          router.navigate("/home", { relativeToDirectory: true })
        }}
      />

      <View style={styles.container}>
        <View style={styles.divider} />
        <Text style={styles.text}> Or Sign Up With </Text>
        <View style={styles.divider} />
      </View>

      <ButtonGoogle onPress={() => {
          router.navigate("/logIn", { relativeToDirectory: true })
        }} />
        <View style={{
          flexDirection:'row',
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

export default SignUp;
