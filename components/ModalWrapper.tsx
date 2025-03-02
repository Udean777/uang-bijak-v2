import { Platform, StyleSheet, View } from "react-native";
import React from "react";
import { ModalWrapperProps } from "@/types";
import { colors, spacingY } from "@/constants/Colors";

const isIos = Platform.OS == "ios";

const ModalWrapper = ({
  children,
  bg = colors.neutral50,
  style,
}: ModalWrapperProps) => {
  return (
    <View style={[styles.container, { backgroundColor: bg }, style && style]}>
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIos ? spacingY._15 : 20,
  },
});
