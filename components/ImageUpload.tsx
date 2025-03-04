import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { ImageUploadProps } from "@/types";
import * as Icons from "phosphor-react-native";
import { colors, radius } from "@/constants/Colors";
import Typography from "./Typography";
import { scale, verticalScale } from "@/utils/style";
import { Image } from "expo-image";
import { getFilePath } from "@/services/imageService";
import * as ImagePicker from "expo-image-picker";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };

  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.inputContainer, containerStyle && containerStyle]}
        >
          <Icons.UploadSimple color={colors.neutral800} />
          {placeholder && (
            <Typography size={15} color={colors.neutral700}>
              {placeholder}
            </Typography>
          )}
        </TouchableOpacity>
      )}

      {file && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity style={styles.deleteIcon} onPress={onClear}>
            <Icons.XCircle
              size={verticalScale(24)}
              weight="fill"
              color={colors.rose}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral200,
    borderRadius: radius._15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: "dashed",
  },
  image: {
    height: scale(150),
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  deleteIcon: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowColor: colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
});
