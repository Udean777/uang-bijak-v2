import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TransactionType, WalletType } from "@/types";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transactionService";
import { useAuth } from "@/context/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import { scale, verticalScale } from "@/utils/style";
import { colors, radius, spacingX, spacingY } from "@/constants/Colors";
import ModalWrapper from "@/components/ModalWrapper";
import CustomHeader from "@/components/CustomHeader";
import BackButton from "@/components/BackButton";
import * as Icons from "phosphor-react-native";
import Typography from "@/components/Typography";
import { Dropdown } from "react-native-element-dropdown";
import ImageUpload from "@/components/ImageUpload";
import CustomInput from "@/components/CustomInput";
import { expenseCategories } from "@/constants/data";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "@/components/CustomButton";
import { fonts } from "@/constants/Fonts";

type paramType = {
  id?: string;
  type?: string;
  amount?: string;
  category?: string;
  date?: string;
  description?: string;
  image?: any;
  uid?: string;
  walletId?: string;
};

const Modal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params: paramType = useLocalSearchParams();
  const oldTransaction: paramType = useLocalSearchParams();

  const [transaction, setTransaction] = useState<TransactionType>({
    type: params.type || "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    data: wallets,
    error: walletError,
    isLoading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;

    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  useEffect(() => {
    if (params.id) {
      setTransaction({
        type: params.type || "expense",
        amount: Number(params.amount || 0),
        description: params.description || "",
        category: params.category,
        date: new Date(params.date || Date.now()),
        walletId: params.walletId || "",
        image: params.image,
      });
    }
  }, []);

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;

    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Alert.alert("Transaksi", "Tolong isi semua form!");
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
    };

    if (params.id) transactionData.id = params.id;

    setIsLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setIsLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaksi", res.msg);
    }
  };

  const onDelete = async () => {
    if (!params.id) return;
    setIsLoading(true);
    const res = await deleteTransaction(params.id, params.walletId || "");
    setIsLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaksi", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert("Confirm", "Apakah kamu yakin ingin menghapus transaksi ini?", [
      {
        text: "Batal",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Hapus",
        onPress: () => onDelete(),
        style: "destructive",
      },
    ]);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <CustomHeader
          title={
            params.id
              ? "Update Transaksi"
              : `Transaksi ${
                  transaction.type === "income" ? "Pemasukan" : "Pengeluaran"
                } baru`
          }
          leftIcon={
            <BackButton
              icon={
                <Icons.X size={verticalScale(26)} color="#fff" weight="bold" />
              }
            />
          }
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typography color={colors.neutral800} size={16}>
              Dompet
            </Typography>
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              activeColor={colors.neutral200}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={wallets.map((wallet) => ({
                label: `${wallet.name} ($${wallet.amount})`,
                value: wallet.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.walletId}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder={"Pilih dompet"}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
            />
          </View>

          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typography color={colors.neutral800} size={16}>
                Kategori Pengeluaran
              </Typography>
              <Dropdown
                style={styles.dropdownContainer}
                placeholderStyle={styles.dropdownPlaceholder}
                activeColor={colors.neutral200}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={transaction.category}
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder={"Pilih Kategori"}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Typography color={colors.neutral800} size={16}>
              Tanggal
            </Typography>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typography color={colors.neutral900} size={14}>
                  {transaction.date.toLocaleString()}
                </Typography>
              </Pressable>
            )}

            {showDatePicker && (
              <View style={Platform.OS == "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="light"
                  value={transaction.date as Date}
                  textColor={colors.neutral900}
                  mode="date"
                  display={Platform.OS == "ios" ? "spinner" : "calendar"}
                  onChange={onDateChange}
                />

                {Platform.OS == "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typography
                      size={15}
                      fontWeight={"500"}
                      color={colors.neutral900}
                    >
                      Pilih
                    </Typography>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Typography color={colors.neutral800} size={16}>
              Jumlah
            </Typography>
            <CustomInput
              // placeholder="Amount"
              keyboardType="numeric"
              value={transaction.amount.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typography color={colors.neutral800} size={16}>
                Deskripsi
              </Typography>
              <Typography color={colors.neutral500}>(optional)</Typography>
            </View>
            <CustomInput
              placeholder="Deskripsi"
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typography color={colors.neutral800} size={16}>
                Bukti Pengeluaran
              </Typography>
              <Typography color={colors.neutral500}>(tidak wajib)</Typography>
            </View>
            <ImageUpload
              placeholder="Unggah Foto"
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              onClear={() => setTransaction({ ...transaction, image: null })}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction.id && !isLoading && (
          <CustomButton
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </CustomButton>
        )}
        <CustomButton
          onPress={onSubmit}
          style={{ flex: 1 }}
          loading={isLoading}
        >
          <Typography
            fontFamily={fonts.NotoSansSemiBold}
            color={colors.neutral100}
            size={17}
          >
            {oldTransaction.id ? "Update Transaksi" : "Buat Transaksi"}
          </Typography>
        </CustomButton>
      </View>
    </ModalWrapper>
  );
};

export default Modal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral300,
    marginBottom: spacingY._15,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropdown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.black,
    borderColor: colors.neutral700,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropdown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.black,
    borderColor: colors.neutral700,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral700,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral300,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral700,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownItemText: {
    color: colors.neutral900,
  },
  dropdownSelectedText: {
    color: colors.neutral900,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.neutral900,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.neutral900,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral700,
  },
});
