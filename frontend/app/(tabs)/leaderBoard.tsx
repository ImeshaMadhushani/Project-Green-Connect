import React, { useEffect, useState } from "react";
import CardReg from "@/components/CardReg";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
//import { Image } from "react-native-elements";
const user = require("@/assets/images/user.png");

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        

const LeaderBoard = () => {
  interface LeaderboardUser {
    id: string;
    username: string;
    totalPoints: number;
  }

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        const response = await axios.get(`${apiUrl}/api/post/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Leaderboard API Response:", response.data);

        if (Array.isArray(response.data.leaderboard)) {
          setLeaderboard(response.data.leaderboard);
        } else {
          console.error("Unexpected API response format:", response.data);
          setLeaderboard([]);
        }

        /*  setLeaderboard(response.data);
        setLoading(false); */
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLeaderboard([]);
        //setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Generate random avatar URL from randomuser.me based on the user's name
  const generateAvatar = (username: string) => {
    return `https://api.randomuser.me/portraits/lego/${Math.floor(
      Math.random() * 10
    )}.jpg`; // Random lego avatar for each user
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerBackground} />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : leaderboard.length > 0 ? (
          leaderboard.map((user, index) => (
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: generateAvatar(user.username) }}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.totalPoints}>{user.totalPoints} pts</Text>
                </View>
                <Text style={styles.rank}>#{index + 1}</Text>
              </View>
          ))
        ) : (
          <Text style={styles.loadingText}>No data available</Text>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 30,
  },
  headerBackground: {
    width: "100%",
    aspectRatio: 1.1,
    position: "absolute",
    backgroundColor: "#0d805a",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
    color: "white",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#0d805a",
    marginRight: 15,
    backgroundColor: "#f0f0f0",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 1,
  },
  totalPoints: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d805a",
  },
});

export default LeaderBoard;


 /*  const ui = (
    <>
      <View
        style={{
          width: "100%",
          aspectRatio: 1.1,
          position: "absolute",
          backgroundColor: "#0d805a",
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 50,
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 5,
            }}
          >
            <View
              style={{
                padding: 5,
                backgroundColor: "#efd910",
                borderRadius: 100,
              }}
            >
              <Image
                style={{
                  width: 120,
                  aspectRatio: 1,
                }}
                source={user}
              />
            </View>
            <View
              style={{
                backgroundColor: "#efd910",
                width: 40,
                borderRadius: 50,
                marginTop: -30,
                aspectRatio: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                1
              </Text>
            </View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Rebecca Max
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              723
            </Text>

            <CardReg bgColor="white" heading="Farina Del Rio">
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text>695</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  2
                </Text>
              </View>
            </CardReg>

            <CardReg bgColor="white" heading="Farina Del Rio">
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text>695</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  2
                </Text>
              </View>
            </CardReg>
            <CardReg bgColor="white" heading="Farina Del Rio">
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text>695</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  2
                </Text>
              </View>
            </CardReg>
            <CardReg bgColor="white" heading="Farina Del Rio">
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text>695</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  2
                </Text>
              </View>
            </CardReg>
          </View>
        </View>
        <View style={{ padding: 10, marginTop: 10 }}></View>
      </ScrollView>
    </>
  );
  return ui;
};
 */
/* const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  text: {},
});

export default LearderBoard;
 */