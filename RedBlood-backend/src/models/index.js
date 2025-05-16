/**
 * Models index file
 * Exports all models for easy importing
 */

const userModel = require('./userModel');
const donationModel = require('./donationModel');
const requestModel = require('./requestModel');

module.exports = {
  userModel,
  donationModel,
  requestModel,
};