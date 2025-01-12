const db = require("../services/db");
const nodemailer = require("nodemailer");
const Appointment = require("../models/appoinment");
const Trainer = require('../models/trainers');

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const sql = "SELECT * FROM user_table WHERE user_email = ? AND user_password = ?";
      const [user] = await db.query(sql, [email, password]);
      console.log("User details:", user); // Add this line for debugging
      if (user) {
        req.session.userId = user.user_id; // Store the user's ID in the session
        req.session.userType = user.user_type; // Store the user's type in the session
        console.log("Logged-in User ID:", req.session.userId); // Log the logged-in user's ID
        console.log("Logged-in User Type:", req.session.userType); // Log the logged-in user's type

        if (user.user_type === 'petTrainer') {
          // Fetch trainer details if the user is a trainer
          const trainer = await Trainer.findByUserId(req.session.userId);
          req.session.trainer = trainer; // Store trainer details in the session
        }

        req.flash('success', 'Login successful'); // Set success flash message
        return res.redirect("/home"); // Redirect to home page upon successful login
      } else {
        req.flash('error', 'Invalid username or password'); // Set error flash message
        return res.redirect("/login"); // Redirect back to login page with flash message
      }
    } catch (error) {
      console.error(error);
      req.flash('error', 'Internal server error'); // Set error flash message
      return res.redirect("/login"); // Redirect back to login page with flash message
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/login');
    });
  },


  register: async (req, res) => {
    const { firstname, lastname, useremail, userphone, usertype, password, confirm_password } = req.body;
  
    try {
      // Check if the email is already registered
      const emailExists = await checkIfEmailExists(useremail);
      if (emailExists) {
        req.flash('error', 'Email already registered'); // Set error flash message
        return res.redirect("/register"); // Redirect back to register page with flash message
      }
  
      // Check if password and confirm password match
      if (password !== confirm_password) {
        req.flash('error', 'Password and confirm password do not match'); // Set error flash message
        return res.redirect("/register"); // Redirect back to register page with flash message
      }
  
      // Proceed with registration if all checks pass
      const userInsert = "INSERT INTO user_table (user_firstname, user_lastname, user_email, user_phonenumber, user_type, user_password) VALUES (?, ?, ?, ?, ?, ?)";
      const userValues = [firstname, lastname, useremail, userphone, usertype, password];
      const userInsertResult = await db.query(userInsert, userValues);
      const insertedId = userInsertResult.insertId;
      console.log(userInsertResult,"console");
  
      if (usertype === 'petTrainer') {
        const { firstname, lastname, useremail } = req.body;
        const { speciality = '', image ='',location = '', experience = 1,certificate='', description = '' } = req.body;
        
        const trainerInsert = "INSERT INTO trainer_table (trainer_name, trainer_email, trainer_speciality,trainer_image, trainer_location, trainer_experience, trainer_certificate,trainer_description, user_id) VALUES (?, ?, ?, ?,?, ?, ?, ?,?)";
        
        const trainerValues = [`${firstname} ${lastname}`, useremail, speciality, image,location, experience,certificate, description, userInsertResult.insertId];
        
        await db.query(trainerInsert, trainerValues);
    }
      req.flash('success', 'Registration successful'); // Set success flash message
      res.redirect("/home"); // Redirect to login page upon successful registration
    } catch (error) {
      console.error("Error:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        req.flash('error', 'Email already registered');
        return res.redirect("/register");
      } else {
        req.flash('error', 'Internal server error');
        return res.redirect("/register");
      }
    }
  },
  updateProfile: async (req, res) => {
    const { name, email, phone, experience, location, bio } = req.body;
    const { id } = req.params;
  
    try {
      // Update user details
      const updateUserQuery = "UPDATE user_table SET user_firstname = ?, user_email = ?, user_phonenumber = ? WHERE user_id = ?";
      await db.query(updateUserQuery, [name, email, phone, req.session.userId]);
  
      // Update trainer details
      await Trainer.update({
        name,
        email,
        phone,
        experience,
        location,
        bio,
        userId: req.session.userId
      });
  
      res.redirect("/trainer-profile"); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const userId = req.session.userId;

      // Delete the associated appointments
      await Appointment.deleteByTrainerId(userId);

      // Delete the trainer profile
      await Trainer.deleteByUserId(userId);

      // Delete the user
      const deleteQuery = `
      DELETE a, b
      FROM trainer_table a
      INNER JOIN appointment_table b ON a.trainer_id = b.trainer_id
      WHERE a.user_id = ?;
    `;

    await db.query(deleteQuery, [userId]);     

      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
        }
        res.redirect('/login');
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

};

async function checkIfEmailExists(email) {
  try {
    const sql = "SELECT COUNT(*) AS count FROM user_table WHERE user_email = ?";
    const [rows] = await db.query(sql, [email]);
    if (rows.length > 0 && rows[0].count > 0) {
      return true; // Email exists
    } else {
      return false; // Email does not exist
    }
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}


module.exports = authController;