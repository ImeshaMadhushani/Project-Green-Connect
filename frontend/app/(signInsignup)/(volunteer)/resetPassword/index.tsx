import { Text, View, StyleSheet } from "react-native";

const ResetPassword = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ResetPassword;
