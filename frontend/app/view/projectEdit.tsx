import React, { useState, useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const EditProject: React.FC = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Edit Project" });
  }, [navigation]);

  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [venue, setVenue] = useState<string>("");

  const handleSave = () => {
    console.log("Updated Project:", { name, date, venue });
  };

  return (
    <View style={styles.container}>
      <TextInput label="Project Name" value={name} onChangeText={setName} mode="outlined" />
      <TextInput label="Date" value={date} onChangeText={setDate} mode="outlined" />
      <TextInput label="Venue" value={venue} onChangeText={setVenue} mode="outlined" />
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save Changes
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  button: { marginTop: 10 ,backgroundColor: "#0D986A"},
});

export default EditProject;
