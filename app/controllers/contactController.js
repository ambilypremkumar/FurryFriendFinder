const db = require("../services/db");

const contactController = {
  submitContactForm: async (formData) => {
    const { name, email, phone, subject, message } = formData;
    try {
      const insertQuery = "INSERT INTO enquiry_table (name, email, phone_number, subject, message, enquiry_status) VALUES (?, ?, ?, ?, ?, 'Pending')";
      await db.query(insertQuery, [name, email, phone, subject, message]);
      return { success: 'Message sent successfully' };
    } catch (error) {
      console.error(error);
      return { error: 'Internal server error' };
    }
  }

};

module.exports = contactController;
