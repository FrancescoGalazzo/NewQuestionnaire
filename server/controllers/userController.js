'use strict';

const userModel = require('../models/userModel');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  getUserById: async (req, res) => {
    try {
      const user = await userModel.getUserById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  createUser: async (req, res) => {
    try {
      const newUser = await userModel.createUser(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }



};

module.exports = userController;
