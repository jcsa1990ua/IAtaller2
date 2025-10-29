/**
 * Debug script to identify issues with anonymization
 */

const anonymizer = require('./src/anonymizer');

console.log('🔍 Debugging Anonymization Issues\n');

// Clear mappings
anonymizer.clearMappings();

// Test case 1: Basic PII anonymization
console.log('Test 1: Basic PII anonymization');
const test1 = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
console.log(`Input: ${test1}`);

const result1 = anonymizer.anonymizeMessage(test1);
console.log(`Output: ${result1}`);

// Check mappings
console.log('\nMappings created:');
const mappings1 = anonymizer.getAllMappings();
for (const [token, mapping] of mappings1) {
  console.log(`${token} → "${mapping.original}" (${mapping.type})`);
}

// Test deanonymization
console.log('\nDeanonymization test:');
const restored1 = anonymizer.deanonymizeMessage(result1);
console.log(`Restored: ${restored1}`);
console.log(`Match: ${test1 === restored1 ? '✅' : '❌'}`);

console.log('\n' + '='.repeat(50) + '\n');

// Test case 2: Phone number issue
console.log('Test 2: Phone number detection');
const test2 = 'Call me at 123-456-7890 or (555) 123-4567';
console.log(`Input: ${test2}`);

// Check what the phone pattern matches
const phoneMatches = test2.match(anonymizer.PII_PATTERNS.phone);
console.log(`Phone matches: ${JSON.stringify(phoneMatches)}`);

const result2 = anonymizer.anonymizeMessage(test2);
console.log(`Output: ${result2}`);

console.log('\n' + '='.repeat(50) + '\n');

// Test case 3: Name detection issue
console.log('Test 3: Name detection');
const test3 = 'Contact John Doe at john@example.com';
console.log(`Input: ${test3}`);

// Check what the name pattern matches
const nameMatches = test3.match(anonymizer.PII_PATTERNS.name);
console.log(`Name matches: ${JSON.stringify(nameMatches)}`);

const result3 = anonymizer.anonymizeMessage(test3);
console.log(`Output: ${result3}`);


