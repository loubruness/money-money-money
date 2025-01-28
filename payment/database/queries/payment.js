import { db } from '../db_connection.js';

// Retreave all payments for the user from the Payment table.
export const getUserPayments = async (Id_User) => {
  try{
    return await db('Payment_Transaction')
    .select('payment_amount', 'status', 'created_at')
    .where('Id_User', Id_User)
    .orderBy('created_at', 'desc');
  }
  catch (error) {
    console.error("Error getting payments:", error);
    throw new Error("Failed to fetch payments");
  }
};

// Insert a payment transaction for the user in the Payment table.
export const insertPayment = async (Id_User, payment_amount, status) => {
  try{
    return await db('Payment_Transaction')
    .insert({ Id_User, payment_amount, status});
  }
  catch (error) {
    console.error("Error inserting payment:", error);
    throw new Error("Failed to insert payment");
  }
};

// Feed the user wallet with the amount provided.
export const feedUserWallet = async (Id_User, amount) => {
  try{
    return await db('User')
    .where('Id_User', Id_User)
    .increment('wallet_balance', amount)
    .returning('wallet_balance');
  }
  catch (error) {
    console.error("Error feeding wallet:", error);
    throw new Error("Failed to feed wallet");
  }
};

// Retrieve if the user exists in the User table
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
}