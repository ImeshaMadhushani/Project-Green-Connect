import ButtonSuccess from "@/components/button-success";
import TextInputStyled from "@/components/text-input";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "react-native-elements";
const user = require("@/assets/images/user.png");

const EditProfile = () => {
  const ui = (
    <ScrollView contentContainerStyle={styles.container}>
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
          <Image
            style={{
              width: 120,
              aspectRatio: 1,
            }}
            source={user}
          />
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
          <ButtonSuccess  label="Edit Profile" />
        </View>
      </View>
      <View style={{ padding: 10, marginTop: 10 }}></View>
    </ScrollView>
  );
  return ui;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  text: {},
});

export default EditProfile;
