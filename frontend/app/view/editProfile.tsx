import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const user = require("@/assets/images/user.png");

const EditProfile = () => {
  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

  };

  const ui = (
    <ScrollView contentContainerStyle={style.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >

        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: 10,
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={handleImagePick} style={style.imageContainer}>
            <Image
              style={style.profileImage}
              source={user}
            />
            <View style={style.iconContainer}>
              <Icon name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <TextInputStyled
            placeholder="First Name"
            value=""
            text="First Name"
          />
          <TextInputStyled
            placeholder="Last Name"
            value=""
            text="Last Name"
          />
          <TextInputStyled
            placeholder="User Name"
            value=""
            text="User Name"
          />
          <TextInputStyled
            placeholder="E-mail"
            value=""
            text="E-mail"
          />
          <TextInputStyled
            placeholder="District"
            value=""
            text="District"
          />
          <TextInputStyled
            placeholder="Area"
            value=""
            text="Area"
          />
          <ButtonSuccess label="Edit Profile" />
        </View>
      </View>
      <View style={{ padding: 10, marginTop: 10 }}></View>
    </ScrollView>
  );
  return ui;
};

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  text: {},
  imageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
  },
  iconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#004d00",
    borderRadius: 20,
    padding: 5,
  },
});

export default EditProfile;



