import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Card from "@/components/Card";

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
        <Card
            bgColor="#dce8d6"
            heading="Plastic-Free Market Campaign"
            content={
                <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <Text>November 10, 2024</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text>9:00 a.m.</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text>Vavuniya, Market</Text>
                </View>
                </View>
            }
         />

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
  cardContent: {
    margin: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default Projects;
