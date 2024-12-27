import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const First = () => {
  const [ngoname, setNgoname] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [type, setType] = useState("");

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  return <View></View>;
};

export default First;
