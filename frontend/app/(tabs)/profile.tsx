import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ route }) => {
  // Sample login data (You can replace this with API/user data)
  const { userType, userName, userEmail } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.title}>GreenConnect</Text>
        <Ionicons name="notifications" size={24} color="black" />
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }} // Placeholder profile image
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
        <TouchableOpacity style={styles.roleButton}>
          <Text style={styles.roleButtonText}>{userType}</Text>
        </TouchableOpacity>
      </View>

      {/* Options */}
      <View style={styles.options}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="folder-open-outline" size={20} color="black" />
          <Text style={styles.optionText}>My Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="document-text-outline" size={20} color="black" />
          <Text style={styles.optionText}>My Articles</Text>
        </TouchableOpacity>
        {userType === 'Volunteer' && (
          <TouchableOpacity style={styles.option}>
            <Ionicons name="trophy-outline" size={20} color="black" />
            <Text style={styles.optionText}>Leaderboard</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.option}>
          <Ionicons name="information-circle-outline" size={20} color="black" />
          <Text style={styles.optionText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="black" />
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
    marginVertical: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  roleButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  roleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  options: {
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;
