const Registration = require("../models/Registration");

const createRegistration = async (req, res) => {
  try {
    const registration = await Registration.create(req.body);

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().populate("eventId");

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
};