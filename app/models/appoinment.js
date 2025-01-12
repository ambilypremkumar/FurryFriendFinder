const db = require("../services/db");

const Appointment = {
  create: async (userId, trainerId, petName, petBreed, appointmentDate, appointmentTime, query) => {
    try {
      console.log("Creating appointment with parameters:", userId, trainerId, petName, petBreed, appointmentDate, appointmentTime, query);
      const sql = "INSERT INTO appointment_table (user_id, trainer_id, pet_name, pet_breed, appointment_date, appointment_time, query, appointment_status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')";
      const values = [userId, trainerId, petName, petBreed, appointmentDate, appointmentTime, query];
      await db.query(sql, values);
      return true;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },
  findAllByTrainerId: async (trainerId) => {
    try {
      const [appointments] = await db.query('SELECT * FROM appointment_table WHERE trainer_id = ?', [trainerId]);
      return appointments;
    } catch (error) {
      console.error('Error finding appointments by trainer id:', error);
      throw error;
    }
  },
  deleteByTrainerId: async (trainerId) => {
    try {
      const deleteQuery = "DELETE FROM appointment_table WHERE trainer_id = ?";
      await db.query(deleteQuery, [trainerId]);
      console.log("Appointments deleted successfully for trainer:", trainerId);
    } catch (error) {
      console.error("Error deleting appointments:", error);
      throw error;
    }
  }
};

module.exports = Appointment;
