/**
 * Test to verify the phone duplication fix
 */

const anonymizer = require('./src/anonymizer');

console.log('🔧 Testing Phone Duplication Fix\n');

// Clear mappings
anonymizer.clearMappings();

// Test the exact example from the user
const testMessage = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
console.log(`Original message: "${testMessage}"`);

// Check what PII is detected
console.log('\nPII Detection:');
const detectedPII = anonymizer.detectPII(testMessage);
console.log('Detected PII:', detectedPII);

// Check individual patterns
console.log('\nIndividual Pattern Testing:');
const emailMatches = testMessage.match(anonymizer.PII_PATTERNS.email);
console.log(`Email matches: ${JSON.stringify(emailMatches)}`);

const phoneMatches = testMessage.match(anonymizer.PII_PATTERNS.phone);
console.log(`Phone matches: ${JSON.stringify(phoneMatches)}`);

const nameMatches = testMessage.match(anonymizer.PII_PATTERNS.name);
console.log(`Name matches: ${JSON.stringify(nameMatches)}`);

// Anonymize
console.log('\nAnonymization:');
const anonymized = anonymizer.anonymizeMessage(testMessage);
console.log(`Anonymized: "${anonymized}"`);

// Check mappings
console.log('\nToken mappings:');
const mappings = anonymizer.getAllMappings();
for (const [token, mapping] of mappings) {
  console.log(`  ${token} → "${mapping.original}" (${mapping.type})`);
}

// Check for duplicates
const phoneMappings = Array.from(mappings.entries()).filter(([token, mapping]) => mapping.type === 'phone');
console.log(`\nPhone mappings count: ${phoneMappings.length}`);
if (phoneMappings.length > 1) {
  console.log('❌ DUPLICATE PHONE MAPPINGS DETECTED!');
  phoneMappings.forEach(([token, mapping]) => {
    console.log(`  ${token} → "${mapping.original}"`);
  });
} else {
  console.log('✅ Only one phone mapping - Good!');
}

// Test token detection
console.log('\nToken Detection:');
const tokenMatches = anonymized.match(anonymizer.TOKEN_PATTERNS.token);
console.log(`Tokens found: ${JSON.stringify(tokenMatches)}`);

// Deanonymize
console.log('\nDeanonymization:');
const restored = anonymizer.deanonymizeMessage(anonymized);
console.log(`Restored: "${restored}"`);

// Final comparison
console.log('\nFinal Comparison:');
console.log(`Original: "${testMessage}"`);
console.log(`Restored: "${restored}"`);
console.log(`Match: ${testMessage === restored ? '✅ PASS' : '❌ FAIL'}`);

if (testMessage !== restored) {
  console.log('\nCharacter-by-character comparison:');
  const origChars = testMessage.split('');
  const restChars = restored.split('');
  
  for (let i = 0; i < Math.max(origChars.length, restChars.length); i++) {
    const origChar = origChars[i] || '[MISSING]';
    const restChar = restChars[i] || '[MISSING]';
    if (origChar !== restChar) {
      console.log(`Position ${i}: "${origChar}" vs "${restChar}"`);
    }
  }
}

console.log('\n✅ Test completed!');


