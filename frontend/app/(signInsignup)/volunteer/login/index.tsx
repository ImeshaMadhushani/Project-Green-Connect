import React, { useState } from "react";
import { View, Text } from "react-native";

const LogIn: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  return (
    <View style={{ flex: 1, width: "100%", padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 50, marginBottom: 60 }}>Welcome Back</Text>
    </View>
  );
};

export default LogIn;
