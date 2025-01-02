import { ReactElement } from "react";
import { ImageSourcePropType, Text, View } from "react-native";
import { Image } from "react-native-elements";

type Props = {
  image?: ImageSourcePropType;
  heading: string;
  bgColor: string;
  content: React.JSX.Element;
};
