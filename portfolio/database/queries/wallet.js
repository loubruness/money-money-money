import { db } from '../db_connection.js';

// Retrieve the current wallet_balance from the User table for the given userId.
export const getWalletBalance = async (Id_User) => {
  try{
    const result = await db('User')
    .select('wallet_balance')
    .where('Id_User', Id_User);

  // Convert the string to a number 
  const walletBalance = parseFloat(result[0].wallet_balance);
  return walletBalance; 
  }
  catch (error) {
    console.error("Error getting wallet balance:", error);
    return 0;
  }
};

// Retrieve all transactions for the user from the Wallet_Transaction table.
export const getWalletTransactions = async (Id_User) => {
  try{
    return await db('Wallet_Transaction')
    .select('transaction_type', 'transaction_amount', 'created_at')
    .where('Id_User', Id_User)
    .orderBy('created_at', 'desc');
  }
  catch (error) {
    console.error("Error getting wallet transactions:", error);
    return [];
  }
};

//Retrieve if the user exists in the User table
export const checkUser = async (Id_User) => {
  try{
    return await db('User')
    .select('Id_User')
    .where('Id_User', Id_User);
  }
  catch (error) {
    console.error("Error checking user:", error);
    return [];
  }
};

// Update the wallet balance of a user
export const updateWalletBalance = async (Id_User, new_balance) => {
  try{
    await db('User')
    .where('Id_User', Id_User)
    .update({ wallet_balance: new_balance });
  }
  catch (error) {
    console.error("Error updating wallet balance:", error);
  }
};

// Insert a new transaction into the Wallet_Transaction table
export const insertTransaction = async (Id_User, transaction_type, transaction_amount) => {
  try {
    const newTransaction = {
      Id_User,
      transaction_type,
      transaction_amount,
      created_at: new Date().toISOString(),
    };
    await db('Wallet_Transaction').insert(newTransaction);
  } catch (error) {
    console.error("Error inserting transaction:", error);
  }
};
