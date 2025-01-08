import { createUserProfile, checkUser } from '../database/queries/account.js';

// Create a new user profile
export const createProfileAction = async (req, res) => {
  try {
    const { user_name, password, role, wallet_balance } = req.body;

    if (!user_name || !password || !role) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (role !== 'agent' && role !== 'investor') {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be "agent" or "investor"' });
    }

    if (wallet_balance < 0) {
      return res.status(400).json({ success: false, error: 'Wallet balance cannot be negative' });
    }

    // Check if username already exists
    const existingUser = await checkUser(user_name, true); // true indicates checking by username
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    const newUserId = await createUserProfile(user_name, password, role, wallet_balance);
    res.status(201).json({ success: true, Id_User: newUserId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
