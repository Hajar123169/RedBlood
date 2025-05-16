/**
 * Request validation middleware using Joi
 */

const Joi = require('joi');

/**
 * Middleware factory for validating request data
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown properties
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: errorMessages,
      });
    }

    // Replace request data with validated data
    req[source] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // User schemas
  user: {
    create: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      fullName: Joi.string().required(),
      bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
      phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,15}$/),
      dateOfBirth: Joi.date().max('now').iso(),
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string(),
      }),
    }),
    update: Joi.object({
      fullName: Joi.string(),
      phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,15}$/),
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string(),
      }),
      notificationPreferences: Joi.object({
        email: Joi.boolean(),
        push: Joi.boolean(),
        sms: Joi.boolean(),
      }),
    }),
  },

  // Authentication schemas
  auth: {
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    register: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      fullName: Joi.string().required(),
      bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
    }),
    forgotPassword: Joi.object({
      email: Joi.string().email().required(),
    }),
    resetPassword: Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(8).required(),
      passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
        .messages({ 'any.only': 'Passwords do not match' }),
    }),
  },

  // Donation schemas
  donation: {
    create: Joi.object({
      donationCenter: Joi.string().required(),
      appointmentDate: Joi.date().iso().min('now').required(),
      donationType: Joi.string().valid('whole_blood', 'plasma', 'platelets', 'double_red_cells').required(),
      notes: Joi.string(),
    }),
    update: Joi.object({
      appointmentDate: Joi.date().iso().min('now'),
      status: Joi.string().valid('scheduled', 'completed', 'cancelled', 'no_show'),
      notes: Joi.string(),
    }),
  },

  // Blood request schemas
  request: {
    create: Joi.object({
      patientName: Joi.string().required(),
      bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
      units: Joi.number().integer().min(1).required(),
      hospital: Joi.string().required(),
      urgency: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
      requiredBy: Joi.date().iso().min('now'),
      contactName: Joi.string().required(),
      contactPhone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
      contactEmail: Joi.string().email(),
      notes: Joi.string(),
      location: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
      }),
    }),
    update: Joi.object({
      units: Joi.number().integer().min(1),
      urgency: Joi.string().valid('low', 'medium', 'high', 'critical'),
      requiredBy: Joi.date().iso().min('now'),
      status: Joi.string().valid('pending', 'active', 'fulfilled', 'cancelled', 'expired'),
      notes: Joi.string(),
    }),
  },

  // ID parameter schema
  id: Joi.object({
    id: Joi.string().required(),
  }),

  // Pagination and filtering schema
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    fields: Joi.string(),
  }),
};

module.exports = {
  validate,
  schemas,
};