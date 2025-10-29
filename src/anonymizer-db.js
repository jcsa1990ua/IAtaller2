/**
 * PII Anonymization Module with MongoDB Persistence
 * 
 * This module contains functions to detect and anonymize Personally Identifiable Information
 * including names, email addresses, and phone numbers. It uses MongoDB for persistent storage.
 */

const crypto = require('crypto');
const TokenMapping = require('../models/TokenMapping');

/**
 * Regular expressions for detecting different types of PII
 */
const PII_PATTERNS = {
  // Email pattern - matches standard email formats
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Phone pattern - matches various phone number formats
  // Supports formats like: 1234567890, 123-456-7890, (123) 456-7890, +1 123 456 7890
  phone: /(\+?[\d\-\(\)\s]{7,20})/g,
  
  // Name pattern - matches sequences of 2-3 capitalized words (excluding common words)
  // This is a basic pattern and might need refinement based on specific requirements
  name: /\b(?!(?:Contact|Call|Email|Phone|Teléfono|Para|Con|At|Or|And|The|A|An|In|On|At|To|For|Of|With|By|Me|My|I|You|We|They|He|She|It)\b)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?\b/g
};

/**
 * Generates a deterministic alphanumeric token for a given input
 * and stores the mapping in MongoDB
 * 
 * @param {string} input - The input to generate token from (usually cleaned)
 * @param {string} type - The type of PII (email, phone, name)
 * @param {string} original - The original PII data (for storage)
 * @returns {Promise<string>} An 8-character alphanumeric token with type prefix
 */
async function generateToken(input, type, original = null) {
  // Create a hash of the input to ensure deterministic tokens
  const hash = crypto.createHash('sha256').update(input.toLowerCase()).digest('hex');
  
  // Take the first 8 characters
  const tokenHash = hash.substring(0, 8);
  
  // Create a prefixed token for easier identification
  const prefixedToken = `${type.toUpperCase()}_${tokenHash}`;
  
  try {
    // Check if token already exists in database
    let mapping = await TokenMapping.findByToken(prefixedToken);
    
    if (mapping) {
      // Token exists, increment usage counter
      await mapping.incrementUsage();
    } else {
      // Create new mapping
      mapping = new TokenMapping({
        token: prefixedToken,
        original: original || input,
        type: type,
        hash: tokenHash
      });
      await mapping.save();
    }
    
    return prefixedToken;
  } catch (error) {
    console.error('Error generating token:', error.message);
    // Fallback: return the token even if DB operation fails
    return prefixedToken;
  }
}

/**
 * Anonymizes email addresses in the text
 * 
 * @param {string} text - The text containing emails
 * @returns {Promise<string>} Text with emails replaced by tokens
 */
async function anonymizeEmails(text) {
  const emailMatches = text.match(PII_PATTERNS.email);
  if (!emailMatches) return text;
  
  let result = text;
  for (const email of emailMatches) {
    const token = await generateToken(email, 'email');
    result = result.replace(email, token);
  }
  
  return result;
}

/**
 * Anonymizes phone numbers in the text
 * 
 * @param {string} text - The text containing phone numbers
 * @returns {Promise<string>} Text with phone numbers replaced by tokens
 */
async function anonymizePhones(text) {
  const phoneMatches = text.match(PII_PATTERNS.phone);
  if (!phoneMatches) return text;
  
  let result = text;
  for (const phone of phoneMatches) {
    // Clean the phone number for consistent token generation
    // Remove spaces, dashes, parentheses, but keep the + if it's at the beginning
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Store the original phone without leading/trailing spaces to avoid duplication
    const originalPhone = phone.trim();
    const token = await generateToken(cleanPhone, 'phone', originalPhone);
    
    // Preserve leading/trailing spaces from the original phone match
    const leadingSpace = phone.match(/^\s*/)[0];
    const trailingSpace = phone.match(/\s*$/)[0];
    
    result = result.replace(phone, leadingSpace + token + trailingSpace);
  }
  
  return result;
}

/**
 * Anonymizes names in the text
 * 
 * @param {string} text - The text containing names
 * @returns {Promise<string>} Text with names replaced by tokens
 */
async function anonymizeNames(text) {
  const nameMatches = text.match(PII_PATTERNS.name);
  if (!nameMatches) return text;
  
  let result = text;
  for (const name of nameMatches) {
    // Split the name and generate tokens for each part
    const nameParts = name.split(/\s+/);
    const tokenPromises = nameParts.map(part => generateToken(part, 'name'));
    const tokens = await Promise.all(tokenPromises);
    result = result.replace(name, tokens.join(' '));
  }
  
  return result;
}

/**
 * Main function to anonymize all PII in a message
 * 
 * @param {string} message - The original message containing PII
 * @returns {Promise<string>} The anonymized message with PII replaced by tokens
 */
async function anonymizeMessage(message) {
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }

  let anonymizedMessage = message;

  // Apply anonymization in order: phones, emails, then names
  // This order helps avoid conflicts between patterns
  anonymizedMessage = await anonymizePhones(anonymizedMessage);
  anonymizedMessage = await anonymizeEmails(anonymizedMessage);
  anonymizedMessage = await anonymizeNames(anonymizedMessage);

  return anonymizedMessage;
}

/**
 * Detects PII in a message without anonymizing it
 * 
 * @param {string} message - The message to analyze
 * @returns {Object} Object containing arrays of detected PII by type
 */
function detectPII(message) {
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }

  const detected = {
    emails: [],
    phones: [],
    names: []
  };

  // Detect emails
  const emailMatches = message.match(PII_PATTERNS.email);
  if (emailMatches) {
    detected.emails = [...new Set(emailMatches)]; // Remove duplicates
  }

  // Detect phones
  const phoneMatches = message.match(PII_PATTERNS.phone);
  if (phoneMatches) {
    detected.phones = [...new Set(phoneMatches)]; // Remove duplicates
  }

  // Detect names
  const nameMatches = message.match(PII_PATTERNS.name);
  if (nameMatches) {
    detected.names = [...new Set(nameMatches)]; // Remove duplicates
  }

  return detected;
}

/**
 * Regular expressions for detecting anonymized tokens
 */
const TOKEN_PATTERNS = {
  // Matches tokens like EMAIL_8004719c6ea5, PHONE_40e83067b9cb, NAME_e1be92e2b3a5
  token: /\b(EMAIL|PHONE|NAME)_[a-f0-9]{8}\b/g
};

/**
 * Deanonymizes a message by replacing tokens with original PII data
 * 
 * @param {string} anonymizedMessage - The message containing tokens
 * @returns {Promise<string>} The original message with PII restored
 */
async function deanonymizeMessage(anonymizedMessage) {
  if (!anonymizedMessage || typeof anonymizedMessage !== 'string') {
    throw new Error('Anonymized message must be a non-empty string');
  }

  let originalMessage = anonymizedMessage;
  const tokenMatches = anonymizedMessage.match(TOKEN_PATTERNS.token);
  
  if (!tokenMatches) {
    return originalMessage;
  }

  // Get all unique tokens
  const uniqueTokens = [...new Set(tokenMatches)];
  
  // Fetch all mappings from database
  for (const token of uniqueTokens) {
    try {
      const mapping = await TokenMapping.findByToken(token);
      if (mapping) {
        // Replace all occurrences of this token with the original value
        originalMessage = originalMessage.split(token).join(mapping.original);
      } else {
        console.warn(`Token not found in database: ${token}`);
      }
    } catch (error) {
      console.error(`Error fetching token ${token}:`, error.message);
    }
  }

  return originalMessage;
}

/**
 * Gets the mapping for a specific token
 * 
 * @param {string} token - The token to look up
 * @returns {Promise<Object|null>} The mapping object or null if not found
 */
async function getTokenMapping(token) {
  try {
    const mapping = await TokenMapping.findByToken(token);
    return mapping ? mapping.toObject() : null;
  } catch (error) {
    console.error('Error getting token mapping:', error.message);
    return null;
  }
}

/**
 * Gets all stored token mappings
 * 
 * @returns {Promise<Array>} All token mappings
 */
async function getAllMappings() {
  try {
    const mappings = await TokenMapping.find({}).lean();
    return mappings;
  } catch (error) {
    console.error('Error getting all mappings:', error.message);
    return [];
  }
}

/**
 * Clears all token mappings (useful for testing)
 */
async function clearMappings() {
  try {
    await TokenMapping.clearAll();
    console.log('All mappings cleared from database');
  } catch (error) {
    console.error('Error clearing mappings:', error.message);
  }
}

/**
 * Gets statistics about stored mappings
 * 
 * @returns {Promise<Object>} Statistics about the mappings
 */
async function getMappingStats() {
  try {
    const stats = await TokenMapping.getStatsByType();
    return stats;
  } catch (error) {
    console.error('Error getting mapping stats:', error.message);
    return {
      total: 0,
      byType: {
        email: 0,
        phone: 0,
        name: 0
      }
    };
  }
}

module.exports = {
  anonymizeMessage,
  deanonymizeMessage,
  detectPII,
  generateToken,
  getTokenMapping,
  getAllMappings,
  clearMappings,
  getMappingStats,
  PII_PATTERNS,
  TOKEN_PATTERNS
};




