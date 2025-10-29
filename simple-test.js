/**
 * Simple test to verify core functionality
 */

const anonymizer = require('./src/anonymizer');

console.log('🧪 Simple Core Functionality Test\n');

// Clear mappings
anonymizer.clearMappings();

// Test 1: Basic anonymization
console.log('Test 1: Basic Anonymization');
const original1 = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
console.log(`Original: ${original1}`);

const anonymized1 = anonymizer.anonymizeMessage(original1);
console.log(`Anonymized: ${anonymized1}`);

// Check if tokens are created
const stats1 = anonymizer.getMappingStats();
console.log(`Mappings created: ${stats1.total}`);
console.log(`By type:`, stats1.byType);

// Test 2: Deanonymization
console.log('\nTest 2: Deanonymization');
const restored1 = anonymizer.deanonymizeMessage(anonymized1);
console.log(`Restored: ${restored1}`);
console.log(`Match: ${original1 === restored1 ? '✅ PASS' : '❌ FAIL'}`);

// Test 3: Phone number specific
console.log('\nTest 3: Phone Number Detection');
const phoneTest = 'Call me at 123-456-7890';
console.log(`Original: ${phoneTest}`);

// Check phone pattern matches
const phoneMatches = phoneTest.match(anonymizer.PII_PATTERNS.phone);
console.log(`Phone matches: ${JSON.stringify(phoneMatches)}`);

const phoneAnonymized = anonymizer.anonymizeMessage(phoneTest);
console.log(`Anonymized: ${phoneAnonymized}`);

// Test 4: Email specific
console.log('\nTest 4: Email Detection');
const emailTest = 'Contact me at test@example.com';
console.log(`Original: ${emailTest}`);

// Check email pattern matches
const emailMatches = emailTest.match(anonymizer.PII_PATTERNS.email);
console.log(`Email matches: ${JSON.stringify(emailMatches)}`);

const emailAnonymized = anonymizer.anonymizeMessage(emailTest);
console.log(`Anonymized: ${emailAnonymized}`);

// Test 5: Name specific
console.log('\nTest 5: Name Detection');
const nameTest = 'John Doe called';
console.log(`Original: ${nameTest}`);

// Check name pattern matches
const nameMatches = nameTest.match(anonymizer.PII_PATTERNS.name);
console.log(`Name matches: ${JSON.stringify(nameMatches)}`);

const nameAnonymized = anonymizer.anonymizeMessage(nameTest);
console.log(`Anonymized: ${nameAnonymized}`);

console.log('\n✅ Simple tests completed!');


