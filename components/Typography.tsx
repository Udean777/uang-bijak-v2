import { StyleSheet, Text, TextStyle } from "react-native";
import React from "react";
import { TypoProps } from "@/types";
import { colors } from "@/constants/Colors";
import { verticalScale } from "@/utils/style";

import { fonts } from "@/constants/Fonts";

const Typography = ({
  size,
  color = colors.neutral700,
  fontWeight = "400",
  fontFamily = fonts.Poppins,
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
    fontFamily,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typography;
