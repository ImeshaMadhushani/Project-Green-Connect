import React, { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import { Ionicons, Feather } from "@expo/vector-icons";
import Card from "@/components/Card";
import * as Location from "expo-location";
import axios from "axios";

const calender = require("../../assets/images/calender.png");
const clock = require("../../assets/images/clock.png");
const pin = require("../../assets/images/pin.png");

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
const { width: screenWidth } = Dimensions.get("window");

interface Event {
  id: string;
  projectName: string;
  projectType: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

interface Post {
  _id: string;
  title: string;
  image?: string;
  username: string;
  content: string;
  category: string;
  points: number;
  createdAt: Date;
}

interface Feedback {
  id: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const Home = () => {
  const projectIcons = {
    "Waste Reduction": "recycle",
    Plantation: "tree",
    "Disaster Preparedness": "alert-circle-outline",
    "Environmental Awareness Campaigns": "bullhorn-outline",
    "Sustainable Gardening & Agriculture": "sprout",
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/project/`);
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      Alert.alert("Error", "Failed to fetch upcoming events");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/post/getTopPosts`);
      if (response.data.success) {
        const topPosts = response.data.posts.map((post: any) => ({
          _id: post._id || "",
          title: post.title || "Untitled",
          image: post.image || undefined,
          username: post.username || "Anonymous",
          content: post.content || "",
          category: post.category || "General",
          points: post.points || 0,
          createdAt: new Date(post.createdAt || Date.now()),
        }));
        setArticles(topPosts);
        setExpandedPosts(topPosts.reduce((acc: Record<string, boolean>, post: Post) => {
          acc[post._id] = false;
          return acc;
        }, {}));
      }
    } catch (error) {
      console.error("Error fetching top posts:", error);
      Alert.alert("Error", "Failed to fetch trending posts");
    }
  }, []);

  const fetchUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required for nearby events");
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation(location.coords);
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/feedback/feedback/approved`);
      if (response.data.success) {
        setFeedback(response.data.feedback.map((item: any) => ({
          id: item._id || "",
          username: item.username || "Anonymous",
          rating: item.rating || 0,
          comment: item.comment || "No comment",
          createdAt: new Date(item.createdAt || Date.now()),
        })));
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedback([]);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchTopPosts(), fetchUserLocation(), fetchFeedback()]);
  }, [fetchProjects, fetchTopPosts, fetchUserLocation, fetchFeedback]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const filteredProjects = userLocation
    ? events.filter((project) =>
        calculateDistance(userLocation.latitude, userLocation.longitude, project.latitude, project.longitude) <= 50
      )
    : [];

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading your experience...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude || 7.8731,
              longitude: userLocation?.longitude || 80.7718,
              latitudeDelta: 2,
              longitudeDelta: 2,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {filteredProjects.map((item) => (
              <Marker
                key={item.id}
                coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                title={item.projectName}
                description={`${item.date} - ${item.location}`}
              />
            ))}
          </MapView>
        </View>

        <SectionHeader title="Upcoming Events" onPress={() => router.push("/(tabs)/projects")} />
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slider}
          renderItem={({ item }) => (
            <EventCard key={item.id} item={item} projectIcons={projectIcons} />
          )}
        />

        <SectionHeader title="What’s Trending" onPress={() => router.push("/news")} />
        {articles.length > 0 ? (
          <FlatList
            data={articles}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slider}
            renderItem={({ item }) => (
              <TrendingCard
                key={item._id}
                item={item}
                expanded={expandedPosts[item._id]}
                toggleExpansion={togglePostExpansion}
                apiUrl={apiUrl}
              />
            )}
          />
        ) : (
          <EmptyState icon="file-text" message="No trending articles available" />
        )}

        <SectionHeader title="User Feedback" />
        {feedback.length > 0 ? (
          <FlatList
            data={feedback}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slider}
            renderItem={({ item }) => (
              <FeedbackCard key={item.id} item={item} />
            )}
          />
        ) : (
          <EmptyState icon="message-square" message="No feedback available yet" />
        )}
      </View>
    </ScrollView>
  );
};

// Reusable Components
const SectionHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <Pressable onPress={onPress} style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onPress && <Ionicons name="chevron-forward-outline" size={24} color="#333" />}
  </Pressable>
);

const EventCard = ({ item, projectIcons }: { item: any; projectIcons: any }) => (
  <View style={styles.cardWrapper}>
    <Card
      bgColor="#dce8d6"
      heading={item.projectName}
      iconName={projectIcons[item.projectType] || "help-circle"}
      content={
        <View style={styles.cardContent}>
          <InfoRow icon={calender} text={item.date} />
          <InfoRow icon={clock} text={item.time} />
          <InfoRow icon={pin} text={item.location} />
        </View>
      }
    />
  </View>
);

const InfoRow = ({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.infoRow}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const TrendingCard = ({
  item,
  expanded,
  toggleExpansion,
  apiUrl,
}: {
  item: Post;
  expanded: boolean;
  toggleExpansion: (id: string) => void;
  apiUrl: string;
}) => (
  <View style={styles.cardWrapper}>
    <Pressable onPress={() => toggleExpansion(item._id)}>
      <View style={styles.trendingCard}>
        <Text style={styles.trendingCardTitle}>{item.title}</Text>
        {item.image && (
          <Image
            source={{ uri: `${apiUrl}/${item.image}` }}
            style={styles.articleImage}
            PlaceholderContent={<ActivityIndicator />}
          />
        )}
        <View style={styles.articleMeta}>
          <Text style={styles.articleAuthor}>By {item.username}</Text>
          <Text style={styles.pointsText}>⭐ {item.points}</Text>
        </View>
        <Text
          style={styles.articlePreview}
          numberOfLines={expanded ? undefined : 3}
          ellipsizeMode="tail"
        >
          {item.content}
        </Text>
        {item.content.length > 150 && (
          <TouchableOpacity
            onPress={() => toggleExpansion(item._id)}
            style={styles.readMoreButton}
          >
            <Text style={styles.readMoreText}>
              {expanded ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  </View>
);

const FeedbackCard = ({ item }: { item: any }) => (
  <View style={styles.cardWrapper}>
    <View style={styles.feedbackCard}>
      <Text style={styles.feedbackHeader}>{`⭐ ${item.rating} - ${item.username}`}</Text>
      <Text style={styles.feedbackText} numberOfLines={4} ellipsizeMode="tail">
        "{item.comment}"
      </Text>
    </View>
  </View>
);

const EmptyState = ({
  icon,
  message,
}: {
  icon: string;
  message: string;
}) => (
  <View style={styles.emptyStateContainer}>
    <Feather
      name={icon as keyof typeof Feather.glyphMap}
      size={30}
      color="#888"
    />
    <Text style={styles.emptyStateText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0000ff",
  },
  mapContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "lightgray",
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sectionHeaderPressed: {
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  slider: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  cardWrapper: {
    width: screenWidth * 0.90,
    marginRight: 15,
  },
  cardContent: {
    margin: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "#555",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  trendingCard: {
    backgroundColor: "#fff8e1",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "100%",
  },
  trendingCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  articleImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  articleAuthor: {
    fontSize: 13,
    color: "#4682B4",
    fontWeight: "500",
  },
  pointsText: {
    fontSize: 13,
    color: "#FFA500",
    fontWeight: "bold",
  },
  articlePreview: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
    marginBottom: 5,
  },
  readMoreButton: {
    alignSelf: "flex-start",
  },
  readMoreText: {
    color: "#4682B4",
    fontSize: 14,
    fontWeight: "500",
  },
  feedbackCard: {
    backgroundColor: "#f7e6c3",
    borderRadius: 12,
    padding: 15,
    height: 100,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: "space-between",
  },
  feedbackHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  feedbackText: {
    fontSize: 13,
    color: "#444",
    fontStyle: "italic",
    marginTop: 8,
  },
  emptyStateContainer: {
    height: 120,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 20,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});

export default Home;