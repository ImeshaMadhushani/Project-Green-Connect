import ButtonGoogle from "@/components/button-google";
import ButtonSuccess from "@/components/button-success";
import ButtonText from "@/components/button-text";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import PhotoUploadStyled from "@/components/PhotoUpload";

import { account, loginWithGoogle } from "@/(services)/appwrite";

//import api from "@/(services)/api";

import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<{
    uri: string;
    name?: string;
    type?: string;
  } | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUsername = (username: string | string[]) => {
    return username.length >= 4 && !username.includes(" ");
  };

  const validatePassword = (password: string | any[]) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    console.log("Sign Up button clicked");
    if (!name.trim()) {
      return Alert.alert("Error", "Please enter your name");
    }
    if (!validateUsername(username)) {
      return Alert.alert(
        "Error",
        "Username must be at least 4 characters and contain no spaces"
      );
    }
    if (!validateEmail(email)) {
      return Alert.alert("Error", "Please enter a valid email address");
    }
    if (!validatePassword(password)) {
      return Alert.alert("Error", "Password must be at least 6 characters");
    }
    if (password !== password2) {
      return Alert.alert("Error", "Passwords do not match");
    }
    if (!profilePhoto?.uri) {
      return Alert.alert("Error", "Please upload a profile photo");
    }

    console.log("All validations passed! Proceeding with API call.");
    console.log(apiUrl);
    /*  try {
        await account.create("unique()", email, password, name);
        router.navigate("/home", { relativeToDirectory: true });
      } catch (error:any) {
        Alert.alert("Sign Up Failed", error.message);
      } 
    
     */

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", "volunteer"); // Fixed role
    if (profilePhoto) {
      formData.append("profile_picture", {
        uri: profilePhoto.uri,
        name: profilePhoto.name || "profile.jpg",
        type: profilePhoto.type || "image/jpeg",
      } as any);
    }
 
    console.log("SignUp Payload:", formData);

    try {
      await axios.post(`${apiUrl}/api/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", "Account created successfully!");
      router.push("/home");
    } catch (error: any) {
      console.error("SignUp Error: ", error.response?.data || error.message);
      Alert.alert(
        "Sign Up Failed",
        error.response?.data?.message || "Network error"
      );
    }
  };


  return (
    <View style={styles.container}>
      <PhotoUploadStyled
        label="Profile Photo"
        onImageSelect={setProfilePhoto}
      />

      <TextInputStyled
        text="Name"
        onChangeText={setName}
        value={name}
        placeholder="Enter Your Name"
      />
      <TextInputStyled
        text="Username"
        onChangeText={setUsername}
        value={username}
        placeholder="Enter Your Username"
      />
      <TextInputStyled
        text="E-mail"
        onChangeText={setEmail}
        value={email}
        placeholder="Enter E-mail"
      />
      <TextInputStyled
        text="Password"
        password
        onChangeText={setPassword}
        value={password}
        placeholder="Enter Password"
      />
      <TextInputStyled
        text="Confirm Password"
        password
        onChangeText={setPassword2}
        value={password2}
        placeholder="Confirm Password"
      />

      <ButtonSuccess label="SIGN UP" onPress={handleSignUp} />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.text}>Or Sign Up With</Text>
        <View style={styles.divider} />
      </View>

      {/*   <ButtonGoogle
        onPress={()}
      /> */}

      <ButtonGoogle onPress={loginWithGoogle} />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already Have An Account?</Text>
        <ButtonText
          label="Login"
          onPress={() =>
            router.navigate("/logIn", { relativeToDirectory: true })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerContainer: {
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
  loginContainer: {
    flexDirection: "row",
  },
  loginText: {
    fontSize: 20,
  },
});

export default SignUp;
