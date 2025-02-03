import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Ensure Expo Router is correctly used


const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.title}>GreenConnect</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }} // Placeholder image
          style={styles.profileImage}
        />
        <Text style={styles.userName}>Anderson Jon</Text>
        <Text style={styles.userEmail}>anderson2@gmail.com</Text>
        <TouchableOpacity style={styles.roleButton}>
          <Text style={styles.roleButtonText}>Volunteer</Text>
        </TouchableOpacity>
      </View>

      {/* Options Section */}
      <View style={styles.optionsSection}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="folder-outline" size={20} color="black" />
          <Text style={styles.optionText}>My Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="document-outline" size={20} color="black" />
          <Text style={styles.optionText}>My Articles</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="trophy-outline" size={20} color="black" />
          <Text style={styles.optionText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="information-circle-outline" size={20} color="black" />
          <Text style={styles.optionText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="chatbubble-outline" size={20} color="black" />
          <Text style={styles.optionText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  roleButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  roleButtonText: {
    color: '#fff',
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
