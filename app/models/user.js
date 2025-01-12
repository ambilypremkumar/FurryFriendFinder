const db = require("../services/db");

const User = {
  // Example method to fetch user data by ID
  findById: async (userId) => {
    try {
      const sql = 'SELECT * FROM user_table WHERE user_id = ?';
      const [user] = await db.query(sql, [userId]);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  // Add more methods as needed, such as createUser, updateUser, deleteUser, etc.
};

module.exports = User;
