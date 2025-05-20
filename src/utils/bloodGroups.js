/**
 * Blood group utility functions
 */

// Blood group types
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Blood group compatibility chart (who can receive from whom)
// Key: Recipient blood group
// Value: Array of compatible donor blood groups
export const COMPATIBLE_DONORS = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal donor
};

// Blood group compatibility chart (who can donate to whom)
// Key: Donor blood group
// Value: Array of compatible recipient blood groups
export const COMPATIBLE_RECIPIENTS = {
  'A+': ['A+', 'AB+'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'B+': ['B+', 'AB+'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+': ['A+', 'B+', 'AB+', 'O+'],
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Universal donor
};

/**
 * Check if a donor can donate to a recipient
 * @param {string} donorBloodGroup - Donor's blood group
 * @param {string} recipientBloodGroup - Recipient's blood group
 * @returns {boolean} True if compatible
 */
export const isCompatible = (donorBloodGroup, recipientBloodGroup) => {
  if (!donorBloodGroup || !recipientBloodGroup) return false;
  
  // Normalize blood groups to uppercase
  const donor = donorBloodGroup.toUpperCase();
  const recipient = recipientBloodGroup.toUpperCase();
  
  // Check if blood groups are valid
  if (!BLOOD_GROUPS.includes(donor) || !BLOOD_GROUPS.includes(recipient)) {
    return false;
  }
  
  // Check compatibility
  return COMPATIBLE_RECIPIENTS[donor].includes(recipient);
};

/**
 * Get all compatible donors for a recipient
 * @param {string} recipientBloodGroup - Recipient's blood group
 * @returns {Array} Array of compatible donor blood groups
 */
export const getCompatibleDonors = (recipientBloodGroup) => {
  if (!recipientBloodGroup) return [];
  
  // Normalize blood group to uppercase
  const recipient = recipientBloodGroup.toUpperCase();
  
  // Check if blood group is valid
  if (!BLOOD_GROUPS.includes(recipient)) {
    return [];
  }
  
  return COMPATIBLE_DONORS[recipient];
};

/**
 * Get all compatible recipients for a donor
 * @param {string} donorBloodGroup - Donor's blood group
 * @returns {Array} Array of compatible recipient blood groups
 */
export const getCompatibleRecipients = (donorBloodGroup) => {
  if (!donorBloodGroup) return [];
  
  // Normalize blood group to uppercase
  const donor = donorBloodGroup.toUpperCase();
  
  // Check if blood group is valid
  if (!BLOOD_GROUPS.includes(donor)) {
    return [];
  }
  
  return COMPATIBLE_RECIPIENTS[donor];
};

/**
 * Get blood group rarity ranking (0 = most common, 7 = rarest)
 * Based on general population statistics
 * @param {string} bloodGroup - Blood group
 * @returns {number} Rarity ranking
 */
export const getBloodGroupRarity = (bloodGroup) => {
  if (!bloodGroup) return -1;
  
  // Normalize blood group to uppercase
  const group = bloodGroup.toUpperCase();
  
  // Check if blood group is valid
  if (!BLOOD_GROUPS.includes(group)) {
    return -1;
  }
  
  // Approximate rarity ranking (0 = most common, 7 = rarest)
  const rarityRanking = {
    'O+': 0, // Most common (~38%)
    'A+': 1, // (~34%)
    'B+': 2, // (~9%)
    'O-': 3, // (~7%)
    'A-': 4, // (~6%)
    'AB+': 5, // (~3%)
    'B-': 6, // (~2%)
    'AB-': 7, // Rarest (~1%)
  };
  
  return rarityRanking[group];
};

/**
 * Get a human-readable description of a blood group
 * @param {string} bloodGroup - Blood group
 * @returns {string} Description
 */
export const getBloodGroupDescription = (bloodGroup) => {
  if (!bloodGroup) return '';
  
  // Normalize blood group to uppercase
  const group = bloodGroup.toUpperCase();
  
  // Check if blood group is valid
  if (!BLOOD_GROUPS.includes(group)) {
    return '';
  }
  
  const descriptions = {
    'O+': 'O Positive - Can donate to O+, A+, B+, AB+',
    'O-': 'O Negative - Universal donor, can donate to anyone',
    'A+': 'A Positive - Can donate to A+ and AB+',
    'A-': 'A Negative - Can donate to A+, A-, AB+, AB-',
    'B+': 'B Positive - Can donate to B+ and AB+',
    'B-': 'B Negative - Can donate to B+, B-, AB+, AB-',
    'AB+': 'AB Positive - Universal recipient, can only donate to AB+',
    'AB-': 'AB Negative - Can donate to AB+ and AB-',
  };
  
  return descriptions[group];
};