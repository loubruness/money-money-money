import { db } from '../db_connection.js';

// Retrieve the current wallet_balance from the User table for the given userId.
export const getWalletBalance = async (Id_User) => {
  try{
    const result = await db('User')
    .select('wallet_balance')
    .where('Id_User', Id_User)
    .first();

  // Convert the string to a number 
  const walletBalance = parseFloat(result.wallet_balance);
  return walletBalance; 
  }
  catch (error) {
    console.error("Error getting wallet balance:", error);
    throw new Error("Failed to fetch wallet balance");
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
    throw new Error("Failed to fetch wallet transactions");
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
    throw new Error("Failed to check user");
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
    throw new Error("Failed to update wallet balance");
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
    throw new Error("Failed to insert transaction");
  }
};

// Retrieve the rental income for a user from the Property table
export const getProperty = async (Id_User, Id_Property) => {
  try {
    return await db('Property')
      .join('Investment', 'Property.Id_Property', '=', 'Investment.Id_Property')
      .select('Property.rental_income_rate', 'Property.property_price')
      .where('Property.Id_Property', Id_Property)
      .andWhere('Investment.Id_User', Id_User)
      .first();
  } catch (error) {
    console.error("Error getting property:", error);
    throw new Error("Failed to fetch property details");
  }
};
