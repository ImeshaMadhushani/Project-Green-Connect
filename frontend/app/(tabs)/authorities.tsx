import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const organization = require("@/assets/images/org.png");

const OrganizationsScreen = () => {
    interface Organization {
      id: number;
      name: string;
      email?: string;
      regNo?: string;
      profile_picture?: string;
    }

    const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const response = await axios.get(`${apiUrl}/api/organization/allapp`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        });
        if (response.data && Array.isArray(response.data.org)) {
          setOrganizations(
            response.data.org.map((org) => ({
              id: org._id, // Assuming MongoDB `_id`
              name: org.NameOfOrganization,
              email: org.ContactDetails?.Email,
              regNo: org.RegistrationNumber, // Ensure this matches
              profile_picture: org.profile_picture,
            }))
          );
        } else {
          console.error("Organizations not found");
          setOrganizations([]); // Ensure state updates even if empty
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
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

 const renderItem = ({ item }: { item: Organization }) => (
   <View style={[styles.card, { backgroundColor: getRandomColor() }]}>
     <View style={styles.row}>
       <Image
         source={
           item.profile_picture
             ? { uri: getProfileImageUrl(item.profile_picture) }
             : organization // Use default image if profile picture is missing
         }
         style={styles.profileImage}
       />
       <View style={styles.textContainer}>
         <Text style={styles.title}>{item.name}</Text>
         {item.email && <Text style={styles.text}>Email: {item.email}</Text>}
         {item.regNo && <Text style={styles.text}>Reg No: {item.regNo}</Text>}
       </View>
     </View>
   </View>
 );

    return (
      <View style={styles.container}>
        {organizations.length > 0 ? (
          <FlatList
            data={organizations}
            keyExtractor={(item) =>
              item.id ? item.id.toString() : `${Math.random()}`
            }
            renderItem={renderItem}
          />
        ) : (
          <Text style={styles.noDataText}>No organizations found</Text>
        )}
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
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default OrganizationsScreen;
