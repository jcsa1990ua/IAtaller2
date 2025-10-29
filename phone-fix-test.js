/**
 * Test to verify the phone number storage fix
 */

const anonymizer = require('./src/anonymizer');

console.log('🔧 Testing Phone Number Storage Fix\n');

// Clear mappings
anonymizer.clearMappings();

// Test phone number specifically
const testMessage = 'Call me at 123-456-7890';
console.log(`Original message: "${testMessage}"`);

// Anonymize
const anonymized = anonymizer.anonymizeMessage(testMessage);
console.log(`Anonymized: "${anonymized}"`);

// Check mappings
console.log('\nToken mappings:');
const mappings = anonymizer.getAllMappings();
for (const [token, mapping] of mappings) {
  console.log(`  ${token} → "${mapping.original}" (${mapping.type})`);
}

// Deanonymize
const restored = anonymizer.deanonymizeMessage(anonymized);
console.log(`\nRestored: "${restored}"`);

// Check if they match
console.log(`\nMatch: ${testMessage === restored ? '✅ PASS' : '❌ FAIL'}`);

// Test the full example
console.log('\n' + '='.repeat(50));
console.log('Testing Full Example\n');

anonymizer.clearMappings();

const fullExample = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
console.log(`Original: "${fullExample}"`);

const fullAnonymized = anonymizer.anonymizeMessage(fullExample);
console.log(`Anonymized: "${fullAnonymized}"`);

const fullRestored = anonymizer.deanonymizeMessage(fullAnonymized);
console.log(`Restored: "${fullRestored}"`);

console.log(`Match: ${fullExample === fullRestored ? '✅ PASS' : '❌ FAIL'}`);

if (fullExample !== fullRestored) {
  console.log('\nCharacter-by-character comparison:');
  const origChars = fullExample.split('');
  const restChars = fullRestored.split('');
  
  for (let i = 0; i < Math.max(origChars.length, restChars.length); i++) {
    const origChar = origChars[i] || '[MISSING]';
    const restChar = restChars[i] || '[MISSING]';
    if (origChar !== restChar) {
      console.log(`Position ${i}: "${origChar}" vs "${restChar}"`);
    }
  }
}

console.log('\n✅ Test completed!');


