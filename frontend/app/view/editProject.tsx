import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Linking,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import ButtonSuccess from "@/components/button-success";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY;

/* const projectTypes = [
  "Waste Reduction",
  "Plantation",
  "Disaster Preparedness",
  "Environmental Awareness Campaigns",
  "Sustainable Gardening & Agriculture",
];
 */

const EditProject = () => {
  const { id } = useLocalSearchParams(); // Get project ID from route params
  const router = useRouter();

  const [project, setProject] = useState({
    title: "",
  /*   type: "", */
    location: "",
    date: "",
    time: "",
    description: "",
    latitude: 0, // Default value for latitude
    longitude: 0, // Default value for longitude
  });

  const [isMapVisible, setIsMapVisible] = useState(false);
  
  // Fetch existing project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/project/${id}`);
        const data = response.data;
        setProject({
          title: data.projectName,
        /*   type: data.projectType, */
          location: data.location,
          date: data.date,
          time: data.time,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      } catch (error) {
        Alert.alert("Error", "Failed to fetch project details.");
      }
    };

    fetchProject();
  }, [id]);

const handleLocationSelect = (latitude, longitude) => {
  // Call handleSaveLocation with the selected coordinates
  handleSaveLocation({ lat: latitude, lng: longitude });
};

// The handleSaveLocation function
const handleSaveLocation = async (selectedLocation: {
  lat: number;
  lng: number;
}) => {
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}&format=json`
    );

    const placeName = response.data.display_name || "Unknown Location";

    // Set the location and coordinates in the state
    setProject((prevProject) => ({
      ...prevProject,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      location: placeName, // Set the location name
    }));

    // Optionally, store the location coordinates in another field
    // Removed the undefined setFields function call

    // Close the map modal
    setIsMapVisible(false);
  } catch (error) {
    console.error("Error fetching location name:", error);
    alert("Failed to fetch location name. Please try again.");
  }
};


  // Fetch latitude and longitude when location changes
/*   useEffect(() => {
    const fetchCoordinates = async () => {
      if (project.location.trim()) {
        try {
          const result = await Location.geocodeAsync(project.location);
          if (result.length > 0) {
            const { latitude, longitude } = result[0];
            setProject((prevProject) => ({
              ...prevProject,
              latitude,
              longitude,
            }));
          } else {
            Alert.alert("Error", "Location not found.");
          }
        } catch (error) {
          console.error("Error fetching location coordinates:", error);
          Alert.alert("Error", "Failed to fetch coordinates.");
        }
      }
    };

    fetchCoordinates();
  }, [project.location]); */

  const handleUpdate = async () => {
    if (
      !project.title ||
      /* !project.type || */
      !project.location ||
      !project.date ||
      !project.time ||
      !project.description
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return console.error("No token found!");

      const response = await axios.put(
        `${apiUrl}/api/project/${id}`,
        {
          projectName: project.title,
          description: project.description,
          date: project.date,
          time: project.time,
          location: project.location,
         /*  projectType: project.type, */
          latitude: project.latitude,
          longitude: project.longitude,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Replace with actual auth token
          },
        }
      );

      Alert.alert("Success", "Project details updated successfully!");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update project"
      );
    }
  };

/*   const openMap = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Enable location permissions to use maps."
      );
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`;
    Linking.openURL(url);
  };
 */
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Project</Text>

        {/* Project Title */}
        <Text style={styles.label}>Project Title</Text>
        <TextInput
          style={styles.input}
          value={project.title}
          onChangeText={(text) => setProject({ ...project, title: text })}
        />

        {/* Project Type Dropdown */}
        {/*  <Text style={styles.label}>Project Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={project.type}
            onValueChange={(itemValue) =>
              setProject({ ...project, type: itemValue })
            }
          >
            <Picker.Item label="Select a project type" value="" />
            {projectTypes.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>
        </View> */}

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        {/*  <TextInput
          style={styles.input}
          value={project.location}
          onChangeText={(text) => setProject({ ...project, location: text })}
        /> */}

        {/* Select location using Map */}
        <Pressable
          onPress={() => setIsMapVisible(true)}
          style={styles.mapButton}
        >
          <Text style={styles.mapButtonText}>Pick Location on Map</Text>
        </Pressable>

        {/* Map Modal */}
        <Modal visible={isMapVisible} animationType="slide">
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: project.latitude || 8.7516,
                longitude: project.longitude || 80.4975,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(event) => {
                const { latitude, longitude } = event.nativeEvent.coordinate;
                handleLocationSelect(latitude, longitude);
              }}
            >
              {project.latitude && project.longitude && (
                <Marker
                  coordinate={{
                    latitude: project.latitude,
                    longitude: project.longitude,
                  }}
                />
              )}
            </MapView>
            <ButtonSuccess
              label="Save Location"
              onPress={() => setIsMapVisible(false)}
            />
            <ButtonSuccess
              label="Cancel"
              onPress={() => setIsMapVisible(false)}
            />
          </View>
        </Modal>

        {/* View on map button */}
        {/*    <Pressable onPress={openMap} style={styles.mapButton}>
          <MaterialCommunityIcons name="map" size={24} color="white" />
          <Text style={styles.mapButtonText}>View on Map</Text>
        </Pressable>
 */}
        {/* Date & Time */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={project.date}
              onChangeText={(text) => setProject({ ...project, date: text })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={project.time}
              onChangeText={(text) => setProject({ ...project, time: text })}
            />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={project.description}
          onChangeText={(text) => setProject({ ...project, description: text })}
        />

        {/* Save Button */}
        <ButtonSuccess label="Save Changes" onPress={handleUpdate} />

        {/* Message to contact admin */}
        <Text style={styles.contactMessage}>
          If you want to delete the project, contact admin via email{" "}
          <Text
            style={styles.email}
            onPress={() => Linking.openURL("mailto:savealife.ngo@gmail.com")}
          >
            savealife.ngo@gmail.com
          </Text>
        </Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2E7D32",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#2E7D32",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0D9B1",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#F0FAF1",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#B0D9B1",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F0FAF1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  mapButtonText: {
    color: "white",
    marginLeft: 10,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "80%",
  },
  contactMessage: {
    fontSize: 14,
    color: "#555",
    marginTop: 20,
    textAlign: "center",
  },
  email: {
    color: "#2E7D32", // You can use any color for the email
    textDecorationLine: "underline",
  },
});

export default EditProject;