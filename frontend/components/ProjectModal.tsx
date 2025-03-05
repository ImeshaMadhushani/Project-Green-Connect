import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import ButtonSuccess from "@/components/button-success";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";
import TextInputStyled from "@/components/text-input";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { PaperProvider } from "react-native-paper";


const ProjectModalt = ({
  visible,
  onClose,
  onSave,
  fields,
  setFields,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  fields: { [key: string]: string };
  setFields: (key: string, value: string) => void;
}) => {
  const [selectedProjectType, setSelectedProjectType] = useState(
    fields.projectType || ""
  );
  const [isMapPickerVisible, setIsMapPickerVisible] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    fields.location ? JSON.parse(fields.location) : null
  );

  const projectCriteriaOptions = [
    "Waste Reduction",
    "Plantation",
    "Disaster Preparedness",
    "Environmental Awareness Campaigns",
    "Sustainable Gardening & Agriculture",
  ];

  const handleSaveLocation = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation);
    setFields("location", JSON.stringify(selectedLocation)); // Save as string for consistent storage
    setIsMapPickerVisible(false);
  };

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const excludedKeys = ["date", "time", "projectType", "location", "projectTitle"];

  const theme = {
    colors: {
      primary: "#4CAF50", // Light green color
      onSurface: "#006400", // Light green text color
      background: "#E8F5E9", // Light greenish background
      surface: "#fff", // Light greenish background for modal
    },
  };

  return (
    <PaperProvider theme={theme}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Create Project</Text>

              {/* Dropdown for Project Type */}
              <Text style={styles.label}>Project Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedProjectType}
                  onValueChange={(itemValue) => {
                    setSelectedProjectType(itemValue);
                    setFields("projectType", itemValue);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a project type" value="" />
                  {projectCriteriaOptions.map((option, index) => (
                    <Picker.Item label={option} value={option} key={index} />
                  ))}
                </Picker>
              </View>

              {/* Project Title Field */}
              <TextInputStyled
                text="Project Title"
                onChangeText={(value) => setFields("projectTitle", value)}
                value={fields.projectTitle || ""}
                placeholder="Enter Project Title"
              />

              {/* Location Picker */}
              <Text style={styles.label}>Location</Text>
              <Pressable
                style={styles.pickerContainer}
                onPress={() => setIsMapPickerVisible(true)}
              >
                <Text>
                  {location
                    ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
                    : "Select Location"}
                </Text>
              </Pressable>

              {/* Map Picker Modal */}
              {isMapPickerVisible && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isMapPickerVisible}
                  onRequestClose={() => setIsMapPickerVisible(false)}
                >
                  <View style={styles.mapModalOverlay}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: location?.lat || 8.7516,
                        longitude: location?.lng || 80.4975,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                      onPress={(event) => {
                        const { latitude, longitude } = event.nativeEvent.coordinate;
                        setLocation({ lat: latitude, lng: longitude });
                      }}
                    >
                      {location && (
                        <Marker
                          coordinate={{
                            latitude: location.lat,
                            longitude: location.lng,
                          }}
                        />
                      )}
                    </MapView>
                    <View style={styles.mapActions}>
                      <ButtonSuccess style={{ width: 150, height: 50 }} label="Save Location" onPress={() => location && handleSaveLocation(location)} />
                      <ButtonSuccess label="Cancel" style={{ width: 150, height: 50 }} onPress={() => setIsMapPickerVisible(false)} />
                    </View>
                  </View>
                </Modal>
              )}

              {/* Date Picker */}
              <TextInputStyled
                text="Date"
                value={fields.date || ""}
                onFocus={() => setOpenDatePicker(true)}
                placeholder="Select Date"
              />
              <DatePickerModal
                locale="en"
                mode="single"
                visible={openDatePicker}
                onDismiss={() => setOpenDatePicker(false)}
                onConfirm={(params) => {
                  const formattedDate = params.date.toISOString().split("T")[0];
                  setFields("date", formattedDate);
                  setOpenDatePicker(false);
                }}
              />

              {/* Time Picker */}
              <TextInputStyled
                text="Time"
                value={fields.time || ""}
                onFocus={() => setOpenTimePicker(true)}
                placeholder="Select Time"
              />
              <TimePickerModal
                visible={openTimePicker}
                onDismiss={() => setOpenTimePicker(false)}
                onConfirm={(params) => {
                  const formattedTime = `${params.hours}:${params.minutes}`;
                  setFields("time", formattedTime);
                  setOpenTimePicker(false);
                }}
              />

              {/* Other Fields */}
              {Object.keys(fields).map((key) => {
                if (excludedKeys.includes(key)) return null;
                return (
                  <TextInputStyled
                    key={key}
                    text={key.replace(/([A-Z])/g, " $1")}
                    onChangeText={(value) => setFields(key, value)}
                    value={fields[key]}
                    placeholder={`Enter ${key}`}
                  />
                );
              })}

              {/* Save & Cancel Buttons */}
              <View style={styles.buttonRow}>
                <ButtonSuccess style={{ width: 100, height: 50 }} label="Save" onPress={onSave} />
                <ButtonSuccess label="Cancel" style={{ width: 100, height: 50 }} onPress={onClose} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
    </PaperProvider>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  modalHeading: {
    fontSize: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
    width: "100%",
    paddingHorizontal: 10,
    color: "#333",
  },
  buttonRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  mapModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 253, 250, 0.97)",
  },
  map: {
    width: "100%",
    height: "80%",
  },
  mapActions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "rgba(245, 253, 250, 0.97)",
  },
  scrollView: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  }
});

export default ProjectModalt;