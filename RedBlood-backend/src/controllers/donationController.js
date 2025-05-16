/**
 * Donation controller
 * Handles blood donation operations
 */

const { donationModel, userModel } = require('../models');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, DONATION_STATUS } = require('../utils/constants');
const { calculateDistance } = require('../utils/helpers');

/**
 * Get all donation centers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getDonationCenters = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 50, services } = req.query;
    
    // Parse filters
    const filters = {};
    if (services) {
      filters.services = services.split(',');
    }
    
    // Parse location
    let location = null;
    if (latitude && longitude) {
      location = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
    }
    
    // Get donation centers
    const centers = await donationModel.getDonationCenters(
      filters,
      location,
      parseFloat(radius)
    );
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        centers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get donation center details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getDonationCenterDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get donation center
    const center = await donationModel.getDonationCenterById(id);
    
    if (!center) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: 'Donation center not found',
      });
    }
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        center,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Schedule a donation appointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.scheduleAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { donationCenterId, appointmentDate, donationType, notes } = req.body;
    
    // Check if donation center exists
    const center = await donationModel.getDonationCenterById(donationCenterId);
    if (!center) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: 'Donation center not found',
      });
    }
    
    // Create donation record
    const donationData = {
      userId,
      donationCenterId,
      appointmentDate: new Date(appointmentDate),
      donationType,
      status: DONATION_STATUS.SCHEDULED,
      notes,
    };
    
    const donation = await donationModel.createDonation(donationData);
    
    // Update user's lastDonation field
    await userModel.updateUser(userId, {
      lastDonation: new Date(),
    });
    
    // Return success response
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: SUCCESS_MESSAGES.DONATION_CREATED,
      data: {
        donation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get upcoming appointments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUpcomingAppointments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user's donations with status 'scheduled'
    const donations = await donationModel.getUserDonations(userId, {
      status: DONATION_STATUS.SCHEDULED,
    });
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        appointments: donations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a donation appointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.cancelAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get donation
    const donation = await donationModel.getDonationById(id);
    
    if (!donation) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.DONATION_NOT_FOUND,
      });
    }
    
    // Check if donation belongs to user
    if (donation.userId !== userId && req.user.customClaims?.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'fail',
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
    
    // Check if donation is already completed or cancelled
    if (donation.status !== DONATION_STATUS.SCHEDULED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'fail',
        message: 'Cannot cancel a donation that is not scheduled',
      });
    }
    
    // Update donation status
    const updatedDonation = await donationModel.updateDonation(id, {
      status: DONATION_STATUS.CANCELLED,
    });
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Appointment cancelled successfully',
      data: {
        donation: updatedDonation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reschedule a donation appointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { appointmentDate } = req.body;
    
    // Get donation
    const donation = await donationModel.getDonationById(id);
    
    if (!donation) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.DONATION_NOT_FOUND,
      });
    }
    
    // Check if donation belongs to user
    if (donation.userId !== userId && req.user.customClaims?.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'fail',
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
    
    // Check if donation is already completed or cancelled
    if (donation.status !== DONATION_STATUS.SCHEDULED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'fail',
        message: 'Cannot reschedule a donation that is not scheduled',
      });
    }
    
    // Update donation
    const updatedDonation = await donationModel.updateDonation(id, {
      appointmentDate: new Date(appointmentDate),
    });
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Appointment rescheduled successfully',
      data: {
        donation: updatedDonation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get donation eligibility criteria
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getEligibilityCriteria = async (req, res, next) => {
  try {
    // Return eligibility criteria
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        eligibility: {
          minAge: 18,
          maxAge: 65,
          minWeight: 50, // kg
          minHemoglobin: {
            male: 13.5, // g/dL
            female: 12.5, // g/dL
          },
          donationInterval: 56, // days
          restrictions: [
            'Recent tattoos or piercings (within 3-6 months)',
            'Recent travel to certain countries',
            'Certain medications',
            'Certain medical conditions',
            'Pregnancy or recent childbirth',
          ],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check user eligibility for donation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.checkEligibility = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { weight, hemoglobin, gender, recentIllness, medications, travel, pregnancy } = req.body;
    
    // Get user data
    const user = await userModel.getUserById(userId);
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
    
    // Check age
    const dob = user.dateOfBirth ? new Date(user.dateOfBirth) : null;
    let age = null;
    let isEligible = true;
    let reasons = [];
    
    if (dob) {
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 18) {
        isEligible = false;
        reasons.push('You must be at least 18 years old to donate blood');
      } else if (age > 65) {
        isEligible = false;
        reasons.push('The maximum age for blood donation is 65 years');
      }
    }
    
    // Check weight
    if (weight && weight < 50) {
      isEligible = false;
      reasons.push('You must weigh at least 50 kg to donate blood');
    }
    
    // Check hemoglobin
    if (hemoglobin) {
      const minHemoglobin = gender === 'female' ? 12.5 : 13.5;
      if (hemoglobin < minHemoglobin) {
        isEligible = false;
        reasons.push(`Your hemoglobin level must be at least ${minHemoglobin} g/dL to donate blood`);
      }
    }
    
    // Check last donation
    if (user.lastDonation) {
      const lastDonation = new Date(user.lastDonation);
      const today = new Date();
      const diffTime = Math.abs(today - lastDonation);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 56) {
        isEligible = false;
        reasons.push(`You must wait at least 56 days between whole blood donations. You can donate again in ${56 - diffDays} days.`);
      }
    }
    
    // Check other factors
    if (recentIllness) {
      isEligible = false;
      reasons.push('You cannot donate if you have been ill recently');
    }
    
    if (medications && medications.length > 0) {
      // In a real app, you would check specific medications
      // For this implementation, we'll assume any medications make the user ineligible
      isEligible = false;
      reasons.push('Some medications may disqualify you from donating blood');
    }
    
    if (travel) {
      // In a real app, you would check specific travel destinations
      // For this implementation, we'll assume any travel makes the user ineligible
      isEligible = false;
      reasons.push('Recent travel to certain areas may disqualify you from donating blood');
    }
    
    if (pregnancy) {
      isEligible = false;
      reasons.push('You cannot donate blood during pregnancy or for 6 weeks after giving birth');
    }
    
    // Return eligibility status
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        isEligible,
        reasons: isEligible ? [] : reasons,
        nextEligibleDate: user.lastDonation ? new Date(new Date(user.lastDonation).setDate(new Date(user.lastDonation).getDate() + 56)) : null,
      },
    });
  } catch (error) {
    next(error);
  }
};