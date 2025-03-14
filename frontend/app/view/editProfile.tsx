import React, { useEffect, useState } from "react";
import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

const user = require("@/assets/images/user.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const EditProfile = () => {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    district: "",
    city: "",
    profile_picture: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return console.error("No token found!");

        const response = await axios.get(`${apiUrl}/api/user/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });

         if (response.data.user) {
           console.log("Fetched user:", response.data.user);
           setUserData({
             id: response.data.user.id, // Fix: Set `id` instead of `_id`
             name: response.data.user.name || "",
             username: response.data.user.username || "",
             email: response.data.user.email || "",
             district: response.data.user.district || "",
             city: response.data.user.city || "",
             profile_picture: response.data.user.profile_picture || "",
           });
         } else {
           console.error("No user found in response data");
         }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Image Picker
  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Handle Profile Update
  const handleProfileUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return console.error("No token found!");

        if (!userData.id) {
          alert("User ID is missing!");
          return;
      }
      
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("district", userData.district);
      formData.append("city", userData.city);

      if (selectedImage) {
        formData.append("profile_picture", {
          uri: selectedImage,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      console.log(`${apiUrl}/api/user/update/${userData.id}`);

      await axios.put(`${apiUrl}/api/user/update/${userData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

    return (
      <ScrollView contentContainerStyle={style.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 10,
              padding: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleImagePick}
              style={style.imageContainer}
            >
              <Image
                style={style.profileImage}
                source={selectedImage ? { uri: selectedImage } : user}
              />
              <View style={style.iconContainer}>
                <Icon name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>

            <TextInputStyled
              placeholder="Name"
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
            <TextInputStyled
              placeholder="Username"
              value={userData.username}
              onChangeText={(text) =>
                setUserData({ ...userData, username: text })
              }
            />
            <TextInputStyled
              placeholder="E-mail"
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />
            <TextInputStyled
              placeholder="District"
              value={userData.district}
              onChangeText={(text) =>
                setUserData({ ...userData, district: text })
              }
            />
            <TextInputStyled
              placeholder="City"
              value={userData.city}
              onChangeText={(text) => setUserData({ ...userData, city: text })}
            />

            <ButtonSuccess label="Edit Profile" onPress={handleProfileUpdate} />
          </View>
        </View>
        <View style={{ padding: 10, marginTop: 10 }}></View>
      </ScrollView>
    );

};

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  text: {},
  imageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
  },
  iconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#004d00",
    borderRadius: 20,
    padding: 5,
  },
});

export default EditProfile;
