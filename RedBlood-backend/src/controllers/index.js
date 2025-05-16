/**
 * Controllers index file
 * Exports all controllers for easy importing
 */

const authController = require('./authController');
const userController = require('./userController');
const donationController = require('./donationController');
const requestController = require('./requestController');

module.exports = {
  authController,
  userController,
  donationController,
  requestController,
};