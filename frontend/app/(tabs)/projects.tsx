import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Projects = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fields, setFields] = useState({
    volunteers: "",
    duration: "",
    description: "",
  });

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Projects</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 25,
    padding: 10,
  },
});

export default Projects;
