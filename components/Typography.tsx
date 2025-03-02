import { StyleSheet, Text, TextStyle } from "react-native";
import React from "react";
import { TypoProps } from "@/types";
import { colors } from "@/constants/Colors";
import { verticalScale } from "@/utils/style";

const Typography = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typography;
