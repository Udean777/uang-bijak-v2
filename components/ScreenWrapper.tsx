import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/Colors";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS == "ios" ? height * 0.06 : 10;

  return (
    <View
      style={[
        { paddingTop, flex: 1, backgroundColor: colors.neutral50 },
        style,
      ]}
    >
      <StatusBar barStyle={"dark-content"} backgroundColor={colors.neutral50} />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
