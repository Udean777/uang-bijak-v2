import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { InputProps } from "@/types";
import { colors, radius, spacingX } from "@/constants/Colors";
import { verticalScale } from "@/utils/style";

const CustomInput = (props: InputProps) => {
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.neutral600}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral800,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
  },
  input: {
    flex: 1,
    color: colors.black,
    fontSize: verticalScale(14),
  },
});
