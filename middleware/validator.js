'use strict';

const { body, param, validationResult } = require('express-validator');


const validators = {
  validateUserId: [
    param('id').isInt().withMessage('User ID must be an integer'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],
  
  validateUserCreation: [
    body('name').notEmpty().withMessage('Name is required'),
    body('questionnaire').isInt().withMessage('Valid questionnaire is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ]
};

module.exports = validators;
