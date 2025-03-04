import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/style";
import { colors } from "@/constants/Colors";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;

    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data" };
    }

    if (id) {
      const oldTransactionsSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      );
      const oldTransaction = oldTransactionsSnapshot.data() as TransactionType;

      const shouldRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;

      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
    } else {
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );

      if (!res.success) return res;
    }

    // Create a clean copy of transaction data without undefined values
    const cleanTransactionData: Partial<TransactionType> = {};

    // Copy all defined properties
    Object.keys(transactionData).forEach((key) => {
      const value = transactionData[key as keyof TransactionType];
      if (value !== undefined) {
        cleanTransactionData[key as keyof TransactionType] = value;
      }
    });

    // Handle image upload if it's a file object
    if (
      image &&
      typeof image === "object" &&
      !(image instanceof URL) &&
      !(typeof image === "string")
    ) {
      const imageUploadRes = await uploadFileToCloudinary(
        image,
        "transactions"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }

      cleanTransactionData.image = imageUploadRes.data;
    }

    // If image is null, explicitly set it to null in Firestore
    // If image is undefined, remove it from the data to be saved
    if (image === null) {
      cleanTransactionData.image = null;
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, cleanTransactionData, { merge: true });

    return {
      success: true,
      data: { ...cleanTransactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.error("Error creating or updating transaction", error);
    return { success: false, msg: error.message };
  }
};

// Remaining functions unchanged...
const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      console.error("Error creating or updating transaction");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "The selected wallet don't have enough balance",
      };
    }

    const updateType = type == "income" ? "totalIncome" : "totalExpenses";

    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating wallet for new transaction", error);
    return { success: false, msg: error.message };
  }
};

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newAmount: number,
  newType: string,
  newWalletId: string
) => {
  try {
    // 1. Revert original transaction
    const originalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );

    if (!originalWalletSnapshot.exists()) {
      return { success: false, msg: "Original wallet not found" };
    }

    const originalWallet = originalWalletSnapshot.data() as WalletType;

    // Revert type determines which total to update (totalIncome or totalExpenses)
    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    // Calculate amount to adjust wallet balance
    // For income: we need to subtract the amount (negative adjustment)
    // For expense: we need to add the amount back (positive adjustment)
    const revertAmountAdjustment =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount) // Remove income (subtract)
        : Number(oldTransaction.amount); // Remove expense (add back)

    // Update wallet balance
    const revertedWalletAmount =
      Number(originalWallet.amount) + revertAmountAdjustment;

    // Update total income/expense
    const revertedTotalAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    // 2. Check if new wallet has enough balance (for expense only)
    if (newType == "expense") {
      // If it's the same wallet, use the reverted amount for check
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet doesn't have enough balance!",
        };
      }

      // If it's a different wallet, check its current balance
      if (oldTransaction.walletId != newWalletId) {
        const newWalletSnapshot = await getDoc(
          doc(firestore, "wallets", newWalletId)
        );

        if (!newWalletSnapshot.exists()) {
          return { success: false, msg: "New wallet not found" };
        }

        const newWallet = newWalletSnapshot.data() as WalletType;

        if (newWallet.amount! < newAmount) {
          return {
            success: false,
            msg: "The selected wallet doesn't have enough balance!",
          };
        }
      }
    }

    // 3. Apply the revert to the original wallet
    await updateDoc(doc(firestore, "wallets", oldTransaction.walletId), {
      amount: revertedWalletAmount,
      [revertType]: revertedTotalAmount,
    });

    // 4. Update the new wallet (might be the same as original)
    const newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );

    if (!newWalletSnapshot.exists()) {
      return { success: false, msg: "New wallet not found" };
    }

    const newWallet = newWalletSnapshot.data() as WalletType;

    // Determine which total to update
    const updateType = newType == "income" ? "totalIncome" : "totalExpenses";

    // Calculate amount adjustment for the wallet balance
    // For income: add the amount
    // For expense: subtract the amount
    const newWalletAdjustment =
      newType == "income" ? Number(newAmount) : -Number(newAmount);

    // Update wallet balance
    const newWalletAmount = Number(newWallet.amount) + newWalletAdjustment;

    // Update total income/expense
    const newTotalAmount = Number(newWallet[updateType]) + Number(newAmount);

    // Apply the changes to the new wallet
    await updateDoc(doc(firestore, "wallets", newWalletId), {
      amount: newWalletAmount,
      [updateType]: newTotalAmount,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating wallet for new transaction", error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }

    const transactionData = transactionSnapshot.data() as TransactionType;

    const transactionType = transactionData.type;
    const transactionAmount = transactionData.amount;

    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    const updateType =
      transactionType == "income" ? "totalIncome" : "totalExpenses";

    // Calculate the new wallet amount
    // If it was income, we need to subtract the amount
    // If it was expense, we need to add the amount back
    const amountAdjustment =
      transactionType == "income" ? -transactionAmount : transactionAmount;

    const newWalletAmount = walletData.amount! + amountAdjustment;

    // Calculate the new total income/expenses amount
    const newTotalAmount = walletData[updateType]! - transactionAmount;

    // For income transactions, we never need to check balance
    // For expense transactions being deleted, we're adding money back, so no need to check either

    // Update the wallet directly
    await updateDoc(walletRef, {
      amount: newWalletAmount,
      [updateType]: newTotalAmount,
    });

    // Delete the transaction
    await deleteDoc(transactionRef);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting transaction", error);
    return { success: false, msg: error.message };
  }
};

export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const weeklyData = getLast7Days();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;

      transaction.id = doc.id;

      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date == transactionDate);

      if (dayData) {
        if (transaction.type == "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.error("Error fetching weekly transaction", error);
    return { success: false, msg: error.message };
  }
};

export const fetchMonthlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const twelveMonthAgo = new Date(today);
    twelveMonthAgo.setMonth(today.getMonth() - 12);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp).toDate();
      const monthName = transactionDate.toLocaleString("default", {
        month: "short",
      });
      const shortYear = transactionDate.getFullYear().toString().slice(-2);

      const monthData = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`
      );

      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          monthData.expense += transaction.amount;
        }
      }
    });

    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        label: month.month,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: month.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.error("Error fetching monthly transaction", error);
    return { success: false, msg: error.message };
  }
};

export const fetchYearlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;

    const transactionQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];

    const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
      const transactionDate = doc.data().date.toDate();

      return transactionDate < earliest ? transactionDate : earliest;
    }, new Date());

    const firstYear = firstTransaction.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearlyData = getYearsRange(firstYear, currentYear);

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionYear = (transaction.date as Timestamp)
        .toDate()
        .getFullYear();

      const yearData = yearlyData.find(
        (year: any) => year.year === transactionYear.toString()
      );

      if (yearData) {
        if (transaction.type === "income") {
          yearData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          yearData.expense += transaction.amount;
        }
      }
    });

    const stats = yearlyData.flatMap((year: any) => [
      {
        value: year.income,
        label: year.year,
        spacing: scale(4),
        labelWidth: scale(25),
        frontColor: colors.primary,
      },
      {
        value: year.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.error("Error fetching yearly transaction", error);
    return { success: false, msg: error.message };
  }
};
