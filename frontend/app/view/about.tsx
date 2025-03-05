import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About GreenConnect</Text>
      </View>

      {/* Overview Section */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.sectionText}>
        GreenConnect is a platform that bridges the gap between volunteers and environmental 
        organizations to collaboratively solve environmental challenges. Whether you're an 
        individual looking to make an impact or an organization seeking volunteers, 
        GreenConnect provides the tools to launch and manage eco-projects effectively.
      </Text>

      {/* How It Works Section */}
      <Text style={styles.sectionTitle}>How It Works</Text>
      <Text style={styles.sectionText}>
        ✅ Organizations create projects and define goals.{"\n"}
        ✅ Volunteers browse and join projects that interest them.{"\n"}
        ✅ Collaboration happens in real-time with updates and communication.{"\n"}
        ✅ Volunteers earn points, badges, and recognition for their contributions.
      </Text>

      {/* Impact Section */}
      <Text style={styles.sectionTitle}>Our Impact</Text>
      <Text style={styles.sectionText}>
        🌱 500,000+ Trees Planted{"\n"}
        ♻️ 100,000 kg of Waste Recycled{"\n"}
        🏡 1,200+ Local Projects Completed{"\n"}
        👥 50,000+ Volunteers Engaged Worldwide
      </Text>

      {/* Team & Partners Section */}
      <Text style={styles.sectionTitle}>Our Team & Partners</Text>
      <Text style={styles.sectionText}>
        GreenConnect is built by a passionate team of environmentalists, technologists, 
        and volunteers who believe in collective action for a better planet. We work 
        closely with NGOs, businesses, and government agencies to drive real change.
      </Text>

      {/* Contact Section */}
      <Text style={styles.sectionTitle}>Contact & Support</Text>
      <Text style={styles.sectionText}>
        📩 Email: support@greenconnect.com{"\n"}
        📞 Phone: +1 (123) 456-7890{"\n"}
        🌍 Website: www.greenconnect.com
      </Text>

      {/* Social Media Links */}
      <Text style={styles.sectionText}>
        Connect with us: 📘 Facebook | 🐦 Twitter | 📷 Instagram | 🎥 YouTube
      </Text>

      {/* Press & Media Section */}
      <Text style={styles.sectionTitle}>Press & Media</Text>
      <Text style={styles.sectionText}>
        GreenConnect has been featured in leading environmental publications and news outlets. 
        For media inquiries, contact us at **press@greenconnect.com**.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default AboutScreen;
