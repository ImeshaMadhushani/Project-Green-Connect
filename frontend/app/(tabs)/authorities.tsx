import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const OrganizationsScreen = () => {
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
              const response = await axios.get(
                `${apiUrl}/api/user/allaprove/org`
              ); 
              setOrganizations(response.data.organizations);
           
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const getRandomColor = () => {
        const colors = ['#E9F0C7', '#F0F8E6', '#FBFBEF', '#F3F3F3', '#E0EDF4', '#E9E5F3']; // some pastel shades
        return colors[Math.floor(Math.random() * colors.length)];
    };

      const getProfileImageUrl = (profilePicture: string) => {
        if (profilePicture) {
          if (profilePicture.startsWith("uploads")) {
            return `${apiUrl}/${profilePicture.replace(/\\/g, "/")}`;
          } else {
            return profilePicture; 
          }
        }
        return null; 
      };

    const renderItem = ({ item }) => (
      <View style={[styles.card, { backgroundColor: getRandomColor() }]}>
        <View style={styles.row}>
          {item.profile_picture ? (
            <Image
              source={{ uri: getProfileImageUrl(item.profile_picture) }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.text}>No profile picture</Text>
          )}

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.name}</Text>
            {item.email && <Text style={styles.text}>Email: {item.email}</Text>}
            {/*   {item.district && (
          <Text style={styles.text}>District: {item.distict}</Text>
        )} */}
            {/*   {item.email && <Text style={styles.text}>Email: {item.email}</Text>}
        {item.website && <Text style={styles.link}>{item.website}</Text>} */}
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        <FlatList
          data={organizations}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : `${Math.random()}`
          }
          renderItem={renderItem}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  card: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
      marginBottom: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1, 
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
  link: {
    fontSize: 14,
    color: "blue",
  },
});

export default OrganizationsScreen;
