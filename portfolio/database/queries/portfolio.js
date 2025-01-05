// database/queries/portfolio.js
import { db } from '../db_connection.js';

// Get all investments for a user, including related property details
export const getUserPortfolio = async (Id_User) => {
  try {
    return await db('Investment')
      .join('Property', 'Investment.Id_Property', '=', 'Property.Id_Property')
      .select(
        'Investment.Id_Investment',
        'Investment.investment_amount',
        'Investment.created_at',
        'Property.property_name',
        'Property.property_type',
        'Property.property_price',
        'Property.rental_income_rate',
        'Property.appreciation_rate',
        'Property.funding_deadline'
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
      const monthlyIncome = (row.rental_income_rate / 100) * row.property_price;
      totalIncome += monthlyIncome;
    });
    return totalIncome;
  } catch (error) {
    console.error('Error calculating rental income:', error);
    return 0;
  }
};

// // Add a new investment for a user
// export const addInvestment = async (Id_User, Id_Property, amount) => {
//   return await db.transaction(async (trx) => {
//     // Validate investment amount
//     if (amount <= 500) {
//       throw new Error('Investment amount must be greater than 500.');
//     }

//     // Lock rows and calculate current year's total investments
//     const currentYear = new Date().getFullYear();
//     const totalInvestmentsThisYear = await trx('Investment')
//       .join('Property', 'Investment.Id_Property', '=', 'Property.Id_Property')
//       .where('Investment.Id_User', Id_User)
//       .andWhere('Property.status', 'funded')
//       .andWhereRaw('EXTRACT(YEAR FROM TO_DATE(Investment.created_at, \'YYYY-MM-DD\')) = ?', [currentYear])
//       .forUpdate()
//       .sum('Investment.investment_amount as total')
//       .first();

//     const totalThisYear = totalInvestmentsThisYear.total || 0;

//     if (totalThisYear + amount > 10000) {
//       throw new Error('Total investments for this year cannot exceed 10,000.');
//     }

//     // Insert the new investment
//     const newInvestment = {
//       Id_User,
//       Id_Property,
//       investment_amount: amount,
//       created_at: new Date().toISOString(),
//     };
//     await trx('Investment').insert(newInvestment);

//     return { success: true, message: 'Investment created successfully.' };
//   });
// };

export const addInvestment = async (Id_User, Id_Property, amount) => {
  try {
    // Start a transaction
    await db.transaction(async (trx) => {
      // Step 1: Check if the user has enough wallet balance
      const user = await trx('User')
        .select('wallet_balance')
        .where({ Id_User })
        .first();

      if (!user || user.wallet_balance < amount) {
        throw new Error('Insufficient wallet balance.');
      }

      // Step 2: Check total investments for the year
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

      // Step 3: Deduct wallet balance
      await trx('User')
        .where({ Id_User })
        .update({
          wallet_balance: user.wallet_balance - amount,
        });

      // Step 4: Add investment
      const newInvestment = {
        Id_User,
        Id_Property,
        investment_amount: amount,
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
