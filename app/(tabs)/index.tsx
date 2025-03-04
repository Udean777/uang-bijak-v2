import { StyleSheet, View } from "react-native";
import React from "react";
import { useAuth } from "@/context/authContext";
import Typography from "@/components/Typography";
import { colors, spacingX, spacingY } from "@/constants/Colors";
import { verticalScale } from "@/utils/style";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getGreeting } from "@/utils/common";
import { fonts } from "@/constants/Fonts";

const Page = () => {
  const { user } = useAuth();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typography size={16} color={colors.neutral800}>
              {getGreeting()}
            </Typography>

            <Typography
              fontFamily={fonts.NotoSansBold}
              size={20}
              fontWeight={"500"}
              color={colors.neutral800}
            >
              {user?.username}
            </Typography>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral400,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
