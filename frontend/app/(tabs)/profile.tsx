import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Ensure Expo Router is correctly used
import AsyncStorage from "@react-native-async-storage/async-storage"; 
const user = require("@/assets/images/user.png");
const pen = require("@/assets/images/pen.png");

const handleLogout = async () => {
  try {
    await AsyncStorage.clear(); // Clear stored user session
    router.replace("/"); // Redirect to index (home screen)
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

const ProfileScreen = () => {
  return (
    <View style={styles.container}>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={user}
          style={styles.profileImage}
        />
        <View>
        <Text style={styles.userName}>Anderson Jon</Text>
        <Text style={styles.userEmail}>anderson2@gmail.com</Text>
        <TouchableOpacity style={styles.roleButton}>
          <Text style={styles.roleButtonText}>Volunteer</Text>
        </TouchableOpacity>
        </View>
        <Pressable onPress={()=>router.navigate("/view/editProfile")}>
          <Image
            style={{
              width: 40,
              aspectRatio: 1,
            }}
            source={pen}
          />
        </Pressable>
      </View>

      {/* Options Section */}
      <View style={styles.optionsSection}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="folder-outline" size={20} color="black" />
          <Text style={styles.optionText} onPress={()=>router.navigate("/view/myProjects")}>My Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={()=>router.navigate("/view/myArticles")}>
          <Ionicons name="document-outline" size={20} color="black" />
          <Text style={styles.optionText}>My Articles</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={()=>router.navigate("/leaderBoard")}>
          <Ionicons name="trophy-outline" size={20} color="black" />
          <Text style={styles.optionText}>Leaderboard</Text>
        </TouchableOpacity>


<TouchableOpacity style={styles.option} onPress={() => router.push("../view/about")}>
<Ionicons name="information-circle-outline" size={20} color="black" />
<Text style={styles.optionText}>About</Text>
</TouchableOpacity>


        <TouchableOpacity style={styles.option} onPress={()=>router.navigate("/view/feedback")}>
          <Ionicons name="chatbubble-outline" size={20} color="black" />
          <Text style={styles.optionText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}  onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="black" />
          <Text style={styles.optionText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  arrowIcon: {
    marginRight: 10, // Adds space between the arrow and the logo
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Makes the title take up remaining space
    textAlign: 'left', // Aligns the title to the left
  },
  profileSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    marginVertical: 20,
    gap: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    minWidth: 100,
    aspectRatio: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: "#7eb20b",
    alignSelf: "flex-start",
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsSection: {
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;
