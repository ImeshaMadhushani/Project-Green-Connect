import React, { useState, useEffect, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  Image as RNImage,
  Animated,
  Dimensions,
  Easing
} from "react-native";
import { Image } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const defaultUserImage = require("@/assets/images/user.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface LeaderboardUser {
  username: string;
  points: number;
  profilePhoto?: string;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headerAnimation] = useState(new Animated.Value(0));
  const [contentAnimation] = useState(new Animated.Value(0));

  // Animations
  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnimation, {
        toValue: 1,
        tension: 10,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnimation, {
        toValue: 1,
        duration: 800,
        delay: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(`${apiUrl}/api/user/getUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.user) {
        setCurrentUser(response.data.user.username);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${apiUrl}/api/post/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const sortedUsers = response.data.users.sort(
          (a: LeaderboardUser, b: LeaderboardUser) => b.points - a.points
        );
        setUsers(sortedUsers);

        const top10Usernames = sortedUsers.slice(0, 10).map(u => u.username);
        if (currentUser && !top10Usernames.includes(currentUser)) {
          const userEntry = sortedUsers.find(u => u.username === currentUser);
          setCurrentUserRank(userEntry || null);
        } else {
          setCurrentUserRank(null);
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch leaderboard");
      }
    } catch (err: any) {
      console.error("Error fetching leaderboard:", err);
      setError(err.message || "An error occurred while fetching the leaderboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadData = async () => {
      await fetchCurrentUser();
      await fetchLeaderboard();
    };
    loadData();
  }, [fetchCurrentUser, fetchLeaderboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <FontAwesome name="trophy" size={24} color="#FFD700" />;
      case 2:
        return <FontAwesome name="trophy" size={20} color="#C0C0C0" />;
      case 3:
        return <FontAwesome name="trophy" size={18} color="#CD7F32" />;
      default:
        return <Text style={[styles.rankText, { color: '#6b7280' }]}>#{rank}</Text>;
    }
  };

  const getCardGradient = (rank: number): [string, string, ...string[]] => {
    switch (rank) {
      case 1:
        return ['#FFF9C4', '#FFEE58'];
      case 2:
        return ['#E0E0E0', '#BDBDBD'];
      case 3:
        return ['#D7CCC8', '#A1887F'];
      default:
        return ['#ffffff', '#f9fafb'];
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700";
      case 2:
        return "#C0C0C0";
      case 3:
        return "#CD7F32";
      default:
        return "#10b981";
    }
  };

  const top10Users = users.slice(0, 10);

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const renderCard = (user: LeaderboardUser, rank: number, isCurrentUser: boolean = false) => {
    const scaleValue = new Animated.Value(1);
    const rotateValue = new Animated.Value(0);

    const onPressIn = () => {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 0.98,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(rotateValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        })
      ]).start();
    };

    const onPressOut = () => {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(rotateValue, {
          toValue: 0,
          friction: 3,
          useNativeDriver: true,
        })
      ]).start();
    };

    const rotateInterpolation = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-2deg']
    });

    const translateYInterpolation = contentAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0]
    });

    return (
      <AnimatedPressable
        key={`${user.username}-${rank}`}
        style={[
          styles.cardContainer,
          { 
            transform: [
              { scale: scaleValue },
              { rotate: rotateInterpolation },
              { translateY: translateYInterpolation }
            ],
            opacity: contentAnimation,
          },
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <LinearGradient
          colors={getCardGradient(rank)}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View style={[
              styles.rankBadge,
              rank <= 3 && styles.topRankBadge
            ]}>
              {getBadge(rank)}
            </View>
            
            <View style={[
              styles.imageContainer,
              rank === 1 && styles.topUserImageContainer,
              isCurrentUser && styles.currentUserImageContainer
            ]}>
              <RNImage
                source={
                  user.profilePhoto
                    ? { uri: `${apiUrl}/${user.profilePhoto}` }
                    : defaultUserImage
                }
                style={styles.userImage}
              />
              {rank <= 3 && (
                <View style={[styles.medalRibbon, { backgroundColor: getMedalColor(rank) }]}>
                  <MaterialIcons 
                    name="military-tech" 
                    size={14} 
                    color="#fff" 
                  />
                </View>
              )}
            </View>
            
            <View style={styles.userInfo}>
              <Text style={[
                styles.userName,
                isCurrentUser && styles.currentUserName
              ]}>
                {user.username} {isCurrentUser && "(You)"}
              </Text>
              <View style={styles.pointsContainer}>
                <Ionicons name="leaf" size={16} color="#10b981" />
                <Text style={styles.userPoints}>{user.points} pts</Text>
              </View>
            </View>
            
            <View style={styles.pointsBadge}>
              <Text style={[
                styles.pointsText,
                { color: getMedalColor(rank) }
              ]}>
                {user.points}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </AnimatedPressable>
    );
  };

  const headerTranslateY = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0]
  });

  const headerScale = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  const headerOpacity = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable 
          style={({ pressed }) => [
            styles.retryButton,
            { transform: [{ scale: pressed ? 0.95 : 1 }] }
          ]} 
          onPress={fetchLeaderboard}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Green background rectangle */}
      <Animated.View 
        style={[
          styles.headerBackground,
          { 
            transform: [
              { translateY: headerTranslateY },
              { scale: headerScale }
            ],
            opacity: headerOpacity,
            zIndex: 0, // Behind everything
          }
        ]}
      >
        <LinearGradient
          colors={['#047857', '#10b981']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>Top Environmental Champions</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
            colors={["#10b981", "#047857"]}
            progressBackgroundColor="#ffffff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Content wrapper with padding to push content down */}
        <View style={[styles.contentWrapper, { paddingTop: width * 0.3 }]}>
          {/* Top user podium */}
          {top10Users.length > 0 && (
            <Animated.View 
              style={[
                styles.podiumContainer,
                { 
                  transform: [{ translateY: contentAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  }) }],
                  opacity: contentAnimation,
                }
              ]}
            >
              {top10Users.length > 1 && (
                <View style={[styles.podiumItem, styles.secondPlace]}>
                  <View style={styles.podiumBadge}>
                    <Text style={styles.podiumBadgeText}>2</Text>
                  </View>
                  <View style={styles.podiumImageContainer}>
                    <RNImage
                      source={
                        top10Users[1].profilePhoto
                          ? { uri: `${apiUrl}/${top10Users[1].profilePhoto}` }
                          : defaultUserImage
                      }
                      style={styles.podiumImage}
                    />
                  </View>
                  <Text style={styles.podiumName}>{top10Users[1].username}</Text>
                  <Text style={styles.podiumPoints}>{top10Users[1].points} pts</Text>
                </View>
              )}
              
              <View style={[styles.podiumItem, styles.firstPlace]}>
                <View style={[styles.podiumBadge, { backgroundColor: '#FFD700' }]}>
                  <Text style={[styles.podiumBadgeText, { color: '#78350f' }]}>1</Text>
                </View>
                <View style={styles.podiumImageContainer}>
                  <RNImage
                    source={
                      top10Users[0].profilePhoto
                        ? { uri: `${apiUrl}/${top10Users[0].profilePhoto}` }
                        : defaultUserImage
                    }
                    style={styles.podiumImage}
                  />
                </View>
                <Text style={styles.podiumName}>{top10Users[0].username}</Text>
                <Text style={styles.podiumPoints}>{top10Users[0].points} pts</Text>
              </View>
              
              {top10Users.length > 2 && (
                <View style={[styles.podiumItem, styles.thirdPlace]}>
                  <View style={[styles.podiumBadge, { backgroundColor: '#CD7F32' }]}>
                    <Text style={styles.podiumBadgeText}>3</Text>
                  </View>
                  <View style={styles.podiumImageContainer}>
                    <RNImage
                      source={
                        top10Users[2].profilePhoto
                          ? { uri: `${apiUrl}/${top10Users[2].profilePhoto}` }
                          : defaultUserImage
                      }
                      style={styles.podiumImage}
                    />
                  </View>
                  <Text style={styles.podiumName}>{top10Users[2].username}</Text>
                  <Text style={styles.podiumPoints}>{top10Users[2].points} pts</Text>
                </View>
              )}
            </Animated.View>
          )}

          {/* Top 10 list */}
          <View style={styles.listContainer}>
            {top10Users.slice(3).map((user, index) =>
              renderCard(user, index + 4)
            )}
          </View>

          {/* Current user's rank if not in top 10 */}
          {currentUserRank && (
            <View style={styles.currentUserSection}>
              <Text style={styles.sectionTitle}>Your Ranking</Text>
              {renderCard(
                currentUserRank, 
                users.findIndex(u => u.username === currentUser) + 1, 
                true
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: width * 0.25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 0,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  contentWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: 20,
    width: '100%',
  },
  podiumItem: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingBottom: 15,
    borderRadius: 16,
    width: width * 0.28,
    position: 'relative',
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  firstPlace: {
    height: 200,
    borderTopWidth: 4,
    borderTopColor: '#FFD700',
  },
  secondPlace: {
    height: 160,
    borderTopWidth: 4,
    borderTopColor: '#C0C0C0',
  },
  thirdPlace: {
    height: 140,
    borderTopWidth: 4,
    borderTopColor: '#CD7F32',
  },
  podiumBadge: {
    position: 'absolute',
    top: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    elevation: 3,
  },
  podiumBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  podiumImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  podiumImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  listContainer: {
    width: '100%',
    marginBottom: 20,
  },
  cardContainer: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 1.5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'white',
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topRankBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  rankText: {
    fontSize: 16,
    fontWeight: "800",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    position: 'relative',
  },
  topUserImageContainer: {
    borderColor: "#FFD700",
    borderWidth: 3,
  },
  currentUserImageContainer: {
    borderColor: "#10b981",
    borderWidth: 3,
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  medalRibbon: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.2,
  },
  currentUserName: {
    color: "#10b981",
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userPoints: {
    fontSize: 13,
    color: "#6b7280",
    marginLeft: 5,
    fontWeight: '500',
  },
  pointsBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
  },
  currentUserSection: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10b981",
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 15,
    color: "#10b981",
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
    maxWidth: '80%',
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default Leaderboard;

