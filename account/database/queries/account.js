import { db } from '../db_connection.js';

// Create a new user profile in the User table
export const createUserProfile = async (user_name, password, role, wallet_balance) => {
  try {
    const [newUserId] = await db('User').insert(
      {
        user_name,
        password,
        role,
        wallet_balance: wallet_balance || 0, // Default balance is 0 if not provided
      },
      'Id_User'
    );
    return newUserId;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Could not create user profile');
  }
};

// Check if the user exists by ID or username
export const checkUser = async (identifier, checkByUsername = false) => {
  try {
    const column = checkByUsername ? 'user_name' : 'Id_User';
    const result = await db('User')
      .select(column)
      .where(column, identifier);
    return result;
  } catch (error) {
    console.error('Error checking user:', error);
    return [];
  }
};
