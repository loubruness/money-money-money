// database/queries/portfolio.js
import { db } from '../db_connection.js';

// Get all investments for a user, including related property details
export const getUserPortfolio = async (Id_User) => {
  try {
    return await db('Investment')
      .join('Property', 'Investment.Id_Property', '=', 'Property.Id_Property')
      .select(
        'Property.property_name',
        'Property.property_type',
        'Property.property_price',
        'Investment.investment_amount',
        'Investment.investment_share'
      )
      .where('Investment.Id_User', Id_User);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
};

// Calculate total monthly rental income dynamically
export const getMonthlyRentalIncome = async (Id_User) => {
  try {
    const result = await db('Investment')
      .join('Property', 'Investment.Id_Property', '=', 'Property.Id_Property')
      .select('Investment.investment_amount', 'Property.rental_income_rate', 'Property.property_price')
      .where('Investment.Id_User', Id_User);

    let totalIncome = 0;
    result.forEach((row) => {
      const monthlyIncome = ((row.rental_income_rate / 100) * row.property_price) / 12;
      totalIncome += monthlyIncome;
    });
    return totalIncome;
  } catch (error) {
    console.error('Error calculating rental income:', error);
    return 0;
  }
};


export const addInvestment = async (Id_User, Id_Property, amount) => {
  try {
    // Start a transaction
    await db.transaction(async (trx) => {
      // Check if the user has enough wallet balance
      const user = await trx('User')
        .select('wallet_balance')
        .where({ Id_User })
        .first();

      if (!user || user.wallet_balance < amount) {
        throw new Error('Insufficient wallet balance.');
      }

      const property = await trx('Property')
        .select('property_price')
        .where({ Id_Property })
        .first();

      if (!property) {
        throw new Error('Property not found.');
      }

      const property_price = parseFloat(property.property_price);

      // Check total investments for the year (lock)
      const currentYear = new Date().getFullYear();
      const totalInvested = await trx('Investment')
        .join('Property', 'Investment.Id_Property', 'Property.Id_Property')
        .sum('Investment.investment_amount as total')
        .where('Investment.Id_User', Id_User)
        .andWhere('Property.status', 'funded')
        .andWhereRaw('EXTRACT(YEAR FROM "Investment"."created_at") = ?', [currentYear])
        .first();

      if (totalInvested.total + amount > 10000) {
        throw new Error('Total investments for the year exceed the limit of 10,000.');
      }

      if (amount <= 500) {
        throw new Error('Investment amount must be greater than 500.');
      }

      // Deduct wallet balance
      await trx('User')
        .where({ Id_User })
        .update({
          wallet_balance: user.wallet_balance - amount,
        });


      const investment_share = amount / property_price;
      // Add investment
      const newInvestment = {
        Id_User,
        Id_Property,
        investment_amount: amount,
        investment_share,
        created_at: new Date().toISOString(),
      };

      await trx('Investment').insert(newInvestment);

      // Commit the transaction
    });

    return { success: true, message: 'Investment added successfully.' };
  } catch (error) {
    console.error('Error adding investment:', error.message);
    throw error;
  }
};
