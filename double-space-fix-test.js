/**
 * Test to verify the double space fix
 */

const anonymizer = require('./src/anonymizer');

console.log('🔧 Testing Double Space Fix\n');

// Clear mappings
anonymizer.clearMappings();

// Test the exact example
const testMessage = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
console.log(`📝 Original Message:`);
console.log(`"${testMessage}"\n`);

// Check what the phone pattern matches
console.log('🔍 Phone Pattern Analysis:');
const phoneMatches = testMessage.match(anonymizer.PII_PATTERNS.phone);
console.log(`Phone matches: ${JSON.stringify(phoneMatches)}`);

if (phoneMatches) {
  phoneMatches.forEach((match, index) => {
    console.log(`  Match ${index + 1}: "${match}"`);
    console.log(`    Trimmed: "${match.trim()}"`);
    console.log(`    Leading spaces: "${match.match(/^\s*/)[0]}"`);
    console.log(`    Trailing spaces: "${match.match(/\s*$/)[0]}"`);
  });
}

// Test anonymization
console.log('\n🔒 Anonymization:');
const anonymized = anonymizer.anonymizeMessage(testMessage);
console.log(`Anonymized: "${anonymized}"`);

// Check token detection
console.log('\n🔍 Token Detection:');
const tokenMatches = anonymized.match(anonymizer.TOKEN_PATTERNS.token);
console.log(`Tokens found: ${JSON.stringify(tokenMatches)}`);

// Check mappings
console.log('\n📊 Token Mappings:');
const mappings = anonymizer.getAllMappings();
for (const [token, mapping] of mappings) {
  console.log(`  ${token} → "${mapping.original}" (${mapping.type})`);
}

// Test deanonymization
console.log('\n🔓 Deanonymization:');
const restored = anonymizer.deanonymizeMessage(anonymized);
console.log(`Restored: "${restored}"`);

// Final comparison
console.log('\n✅ Final Comparison:');
console.log(`Original: "${testMessage}"`);
console.log(`Restored: "${restored}"`);
console.log(`Match: ${testMessage === restored ? '✅ PASS' : '❌ FAIL'}`);

if (testMessage !== restored) {
  console.log('\n🔍 Character-by-character analysis:');
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

// Test with different phone formats
console.log('\n🧪 Testing Different Phone Formats:');
const testCases = [
  'Call me at 123-456-7890',
  'My number is (555) 123-4567',
  'Contact +1 800 555 0123',
  'Phone: 9876543210'
];

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: "${testCase}"`);
  
  anonymizer.clearMappings();
  const anonymized = anonymizer.anonymizeMessage(testCase);
  const restored = anonymizer.deanonymizeMessage(anonymized);
  
  console.log(`  Anonymized: "${anonymized}"`);
  console.log(`  Restored: "${restored}"`);
  console.log(`  Match: ${testCase === restored ? '✅' : '❌'}`);
});

console.log('\n🎉 Test completed!');



