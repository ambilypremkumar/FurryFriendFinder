// trainers.js
const db = require("../services/db");


const Trainer = {
  fetchAll: async () => {
    // Assuming this method fetches all trainers from the database
   
    return await db.query('SELECT * FROM trainer_table');
  },
  search: async (query) => {
    // Assuming this method searches for trainers based on the query

    return await db.query('SELECT * FROM trainer_table WHERE trainer_name LIKE ? OR trainer_location LIKE ?', [`%${query}%`, `%${query}%`]);
  },
  findById: async (id) => {
    try {
      const sql = 'SELECT * FROM trainer_table WHERE trainer_id = ?';
      const [trainer] = await db.query(sql, [id]);
      return trainer;
    } catch (error) {
      throw new Error('Error fetching trainer details');
    }
  },
  getUserById : async (userId) => {
    const sql = "SELECT * FROM user_table WHERE user_id = ?";
    const [user] = await db.query(sql, [userId]);
    return user;
},
 
    // Fetch trainer details by user_id
    findByUserId: async (userId) => {
      try {
        const sql = `
          SELECT 
            t.trainer_id, 
            t.trainer_name, 
            t.trainer_email, 
            t.trainer_speciality,
            t.trainer_image,
            t.trainer_location, 
            t.trainer_experience, 
            t.trainer_certificate, 
            t.trainer_description, 
            u.user_phonenumber AS phone
          FROM 
            trainer_table t
          JOIN 
            user_table u ON t.user_id = u.user_id
          WHERE 
            t.user_id = ?
        `;
        const [trainer] = await db.query(sql, [userId]);
        
        return trainer;
      } catch (error) {
        throw new Error('Error fetching trainer details by user ID');
      }
    },
    update: async ({ name, email, phone, location, bio, experience, userId }) => {
      try {
        const updateQuery = "UPDATE trainer_table SET trainer_name = ?, trainer_email = ?, trainer_experience = ?, trainer_location = ?, trainer_description = ? WHERE user_id = ?";
        const updateUserQuery = "UPDATE user_table SET user_phonenumber = ? WHERE user_id = ?";
        
        // Execute the update queries
        await db.query(updateQuery, [name, email, experience, location, bio, userId]);
        await db.query(updateUserQuery, [phone, userId]);
      } catch (error) {
        throw new Error(`Error updating trainer details: ${error.message}`);
      }
    },
    deleteByUserId: async (userId) => {
      try {
        // Delete appointments related to the trainer
        const deleteAppointmentsQuery = "DELETE FROM appointment_table WHERE trainer_id = ?";
        await db.query(deleteAppointmentsQuery, [userId]);
  
        // Delete the trainer profile
        const deleteQuery = "DELETE FROM trainer_table WHERE user_id = ?";
        await db.query(deleteQuery, [userId]);
  
        // Delete the user
        const deleteUserQuery = "DELETE FROM user_table WHERE user_id = ?";
        await db.query(deleteUserQuery, [userId]);
      } catch (error) {
        throw new Error(`Error deleting trainer profile: ${error.message}`);
      }
    },
    deleteByTrainerId: async (trainerId) => {
      try {
        const sql = "DELETE FROM review WHERE trainer_id = ?";
        await db.query(sql, [trainerId]);
      } catch (error) {
        console.error("Error deleting reviews:", error);
        throw error;
      }
    }
    
};

module.exports = Trainer;


