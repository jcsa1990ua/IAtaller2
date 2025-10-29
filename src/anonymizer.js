/**
 * PII Anonymization Module
 * 
 * This module contains functions to detect and anonymize Personally Identifiable Information
 * including names, email addresses, and phone numbers. It also supports deanonymization
 * by maintaining mappings between tokens and original PII data.
 */

const crypto = require('crypto');

/**
 * In-memory storage for token-to-PII mappings
 * In a production environment, this should be replaced with a persistent database
 */
const tokenMappings = new Map();

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
 * and stores the mapping for deanonymization
 * 
 * @param {string} input - The input to generate token from (usually cleaned)
 * @param {string} type - The type of PII (email, phone, name)
 * @param {string} original - The original PII data (for storage)
 * @returns {string} An 8-character alphanumeric token with type prefix
 */
function generateToken(input, type, original = null) {
  // Create a hash of the input to ensure deterministic tokens
  const hash = crypto.createHash('sha256').update(input.toLowerCase()).digest('hex');
  
  // Take the first 8 characters and convert to alphanumeric
  const token = hash.substring(0, 8);
  
  // Create a prefixed token for easier identification
  const prefixedToken = `${type.toUpperCase()}_${token}`;
  
  // Store the mapping for deanonymization (use original if provided, otherwise use input)
  tokenMappings.set(prefixedToken, {
    original: original || input,
    type: type,
    token: token
  });
  
  return prefixedToken;
}

/**
 * Anonymizes email addresses in the text
 * 
 * @param {string} text - The text containing emails
 * @returns {string} Text with emails replaced by tokens
 */
function anonymizeEmails(text) {
  return text.replace(PII_PATTERNS.email, (email) => {
    return generateToken(email, 'email');
  });
}

/**
 * Anonymizes phone numbers in the text
 * 
 * @param {string} text - The text containing phone numbers
 * @returns {string} Text with phone numbers replaced by tokens
 */
function anonymizePhones(text) {
  return text.replace(PII_PATTERNS.phone, (phone) => {
    // Clean the phone number for consistent token generation
    // Remove spaces, dashes, parentheses, but keep the + if it's at the beginning
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Store the original phone without leading/trailing spaces to avoid duplication
    const originalPhone = phone.trim();
    const token = generateToken(cleanPhone, 'phone', originalPhone);
    
    // Preserve leading/trailing spaces from the original phone match
    const leadingSpace = phone.match(/^\s*/)[0];
    const trailingSpace = phone.match(/\s*$/)[0];
    
    return leadingSpace + token + trailingSpace;
  });
}

/**
 * Anonymizes names in the text
 * 
 * @param {string} text - The text containing names
 * @returns {string} Text with names replaced by tokens
 */
function anonymizeNames(text) {
  return text.replace(PII_PATTERNS.name, (name) => {
    // Split the name and generate tokens for each part
    const nameParts = name.split(/\s+/);
    const tokens = nameParts.map(part => generateToken(part, 'name'));
    return tokens.join(' ');
  });
}

/**
 * Main function to anonymize all PII in a message
 * 
 * @param {string} message - The original message containing PII
 * @returns {string} The anonymized message with PII replaced by tokens
 */
function anonymizeMessage(message) {
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }

  let anonymizedMessage = message;

  // Apply anonymization in order: phones, emails, then names
  // This order helps avoid conflicts between patterns
  anonymizedMessage = anonymizePhones(anonymizedMessage);
  anonymizedMessage = anonymizeEmails(anonymizedMessage);
  anonymizedMessage = anonymizeNames(anonymizedMessage);

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
 * @returns {string} The original message with PII restored
 */
function deanonymizeMessage(anonymizedMessage) {
  if (!anonymizedMessage || typeof anonymizedMessage !== 'string') {
    throw new Error('Anonymized message must be a non-empty string');
  }

  let originalMessage = anonymizedMessage;

  // Replace all tokens with their original values
  originalMessage = originalMessage.replace(TOKEN_PATTERNS.token, (token) => {
    const mapping = tokenMappings.get(token);
    if (mapping) {
      return mapping.original;
    } else {
      // If token not found in mappings, return the token as-is
      console.warn(`Token not found in mappings: ${token}`);
      return token;
    }
  });

  return originalMessage;
}

/**
 * Gets the mapping for a specific token
 * 
 * @param {string} token - The token to look up
 * @returns {Object|null} The mapping object or null if not found
 */
function getTokenMapping(token) {
  return tokenMappings.get(token) || null;
}

/**
 * Gets all stored token mappings
 * 
 * @returns {Map} All token mappings
 */
function getAllMappings() {
  return new Map(tokenMappings);
}

/**
 * Clears all token mappings (useful for testing)
 */
function clearMappings() {
  tokenMappings.clear();
}

/**
 * Gets statistics about stored mappings
 * 
 * @returns {Object} Statistics about the mappings
 */
function getMappingStats() {
  const stats = {
    total: tokenMappings.size,
    byType: {
      EMAIL: 0,
      PHONE: 0,
      NAME: 0
    }
  };

  for (const [token, mapping] of tokenMappings) {
    stats.byType[mapping.type.toUpperCase()]++;
  }

  return stats;
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
