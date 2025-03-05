import React from "react";
import  { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const user = require("@/assets/images/user.png");
const pen = require("@/assets/images/pen.png");


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ProfileScreen = () => {
  const [userData, setUserData] = useState<{
    user?: {
      name: string;
      email: string;
      role: string;
      profile_picture?: string;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          console.error("No token found!");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiUrl}/api/user/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched user data:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("No token found!");
        return;
      }

      // Log out user
      await axios.post(
        `${apiUrl}/api/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear token after logging out
      await AsyncStorage.removeItem("authToken");

      router.replace("/logIn");

      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  console.log("Profile Picture URL:", userData?.user?.profile_picture);

  const profilePicUrl =
    userData?.user?.profile_picture &&
    userData.user.profile_picture.startsWith("uploads")
      ? `${apiUrl}/${userData.user.profile_picture.replace(/\\/g, "/")}`
      : null; // Return null if there's no valid URL
  console.log("Profile Picture URL:", profilePicUrl);
  
  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={profilePicUrl ? { uri: profilePicUrl } : user} // Use default image if URI is null
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            {userData?.user?.name || "Loading..."}
          </Text>
          <Text style={styles.userEmail}>
            {userData?.user?.email || "Loading..."}
          </Text>
          <TouchableOpacity style={styles.roleButton}>
            <Text style={styles.roleButtonText}>
              {userData?.user?.role || "Loading..."}
            </Text>
          </TouchableOpacity>
        </View>
        <Pressable onPress={() => router.navigate("/view/editProfile")}>
          <Image style={styles.penIcon} source={pen} />
        </Pressable>
      </View>

      {/* Options Section */}
      <View style={styles.optionsSection}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="folder-outline" size={20} color="#4CAF50" />
          <Text style={styles.optionText}>My Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="document-outline" size={20} color="#4CAF50" />
          <Text style={styles.optionText}>My Articles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.navigate("/leaderBoard")}
        >
          <Ionicons name="trophy-outline" size={20} color="#4CAF50" />
          <Text style={styles.optionText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#4CAF50"
          />
          <Text style={styles.optionText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
          <Text style={styles.optionText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#4CAF50" />
          <Text style={styles.optionText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
    marginVertical: 4,
  },
  roleButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  roleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  penIcon: {
    width: 30,
    height: 30,
  },
  optionsSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginLeft: 16,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
});

export default ProfileScreen;
