import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TextInputStyled from "@/components/text-input";
import { router } from "expo-router";
import ButtonSuccess from "@/components/button-success";

const First = () => {
  const [ngoname, setNgoname] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

 const handleNext = async () => {
  // Trimmed input values
  const trimmedNgoName = ngoname?.trim();
  const trimmedUniqueId = uniqueId?.trim();
  const trimmedRegistrationDate = registrationDate?.trim();

  // Basic validation
  if (!trimmedNgoName || !trimmedUniqueId || !trimmedRegistrationDate) {
    Alert.alert("Error", "Please fill all fields");
    return;
  }

  // Unique ID validation (alphanumeric check)
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  if (!idRegex.test(trimmedUniqueId)) {
    Alert.alert("Error", "Unique ID must be alphanumeric and can include _ or -");
    return;
  }

  // Registration Date validation //YYYY-MM-DD format
  const date = new Date(trimmedRegistrationDate);
  const today = new Date();
  
  if (isNaN(date.getTime())) {
    Alert.alert("Error", "Invalid date format");
    return;
  }

  if (date > today) {
    Alert.alert("Error", "Registration date cannot be in the future");
    return;
  }

  // Navigate to next page with validated parameters
  router.push({
    pathname: "./secondPage",
    params: { ngoname: trimmedNgoName, uniqueId: trimmedUniqueId, registrationDate: trimmedRegistrationDate },
  });
};


  

  const ui = (
    <View
      style={{
        flex: 1,
        width: "100%",
        padding: 20,
        alignItems: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: 10,
        }}
      >
        <View
          style={{
            width: 15,
            height: 15,
            borderColor: "#0D7C66",
            borderWidth: 2,
            borderRadius: "100%",
            backgroundColor: "#0D7C66",
          }}
        />
        <View
          style={{
            width: 15,
            height: 15,
            borderColor: "#0D7C66",
            borderWidth: 2,
            borderRadius: "100%",
          }}
        />
        <View
          style={{
            width: 15,
            height: 15,
            borderColor: "#0D7C66",
            borderWidth: 2,
            borderRadius: "100%",
          }}
        />
      </View>
      <TextInputStyled
          ref={input1Ref}
          returnKeyType="next"
          text="Organization Name"
          onChangeText={setNgoname}
          value={ngoname}
          placeholder={"Enter the name of your NGO"}
        />
      <TextInputStyled
        ref={input2Ref}
        returnKeyType="next"
        text="Registration No"
        onChangeText={setUniqueId}
        value={uniqueId}
        placeholder={"Enter the reg no"}
      />
      <TextInputStyled
        ref={input3Ref}
        returnKeyType="done"
        text="Registration Date"
        onChangeText={setRegistrationDate}
        value={registrationDate}
        placeholder="Enter the reg date"
      />
  
      <View style={{ flex: 1, flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          width: "100%", }}>
        <ButtonSuccess
          style={{ width: 100, height: 45,}}
          label="Back"
          onPress={() => {
            router.navigate("/", { relativeToDirectory: true });
          }}
        />
      <ButtonSuccess
        label="Next"
        style={{ width: 100, height: 45,}}
        onPress={() => {
          /* router.navigate("/secondPage", { relativeToDirectory: true }); */
          handleNext();
        }}
      />
    </View>
    </View>
  );
  
  return ui;

};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  text: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#555",
  },
});

export default First;
