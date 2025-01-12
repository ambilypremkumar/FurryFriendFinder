
const db = require("../services/db");
const Trainer = require('../models/trainers');
const Appointment = require('../models/appoinment');

const trainerController = {

    finder: async (req, res) => {
        try {
            let trainers;
            if (req.query.query) {
                // If there is a search query
                trainers = await Trainer.search(req.query.query);
            } else {
                // If there is no search query, fetch all trainers
                trainers = await Trainer.fetchAll();
            }
            res.render('finder', { trainers, query: req.query.query || '' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    trainerprofile: async (req, res) => {
        try {
            if (!req.session.userId) {
                throw new Error('User ID is missing');
            }

            const trainer = await Trainer.findByUserId(req.session.userId);
            if (!trainer) {
                throw new Error('Trainer details not found');
            }

            res.render('trainerProfile', { trainer });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    // Get trainer profile for editing
    editProfile: async (req, res) => {
        try {
            const trainer = await Trainer.findById(req.params.id);
            const user = await Trainer.getUserById(trainer.user_id); // Fetch user details using user_id
            res.render('trainerProfileEdit', { trainer, user });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // Update trainer profile
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
            phone, // Corrected to phone
            experience,
            location,
            bio,
            userId: req.session.userId
          });
      
          res.redirect(`/trainer-profile/${id}`);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
      },


    details: async (req, res) => {
        try {
            const trainer = await Trainer.findById(req.params.id);
            res.render('trainerPage', { trainer });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    appoinments: async (req, res) => {
        try {
            // const trainer = await Trainer.findByUserId(req.session.userId);
            // console.log("trainer",trainer);
            // const appointments = await Appointment.findAllByTrainerId(trainer.id);
            res.render('trainerDashboard');
        } catch (error) {
            // console.error('Error fetching appointments:', error);
            // res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    
    

};



module.exports = trainerController;
