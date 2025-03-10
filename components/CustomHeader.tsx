import { StyleSheet, View } from "react-native";
import React from "react";
import { HeaderProps } from "@/types";
import Typography from "./Typography";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";

const CustomHeader = ({
  title = "",
  leftIcon,
  style,
  titleColor = colors.neutral900,
}: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typography
          size={22}
          fontWeight={"600"}
          color={titleColor}
          fontFamily={fonts.PoppinsBold}
          style={{
            textAlign: "center",
            width: leftIcon ? "82%" : "100%",
          }}
        >
          {title}
        </Typography>
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  leftIcon: {
    alignSelf: "flex-start",
  },
});
