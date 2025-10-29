/**
 * Test to verify the fixes for Test 2 and Test 3
 */

const anonymizer = require('./src/anonymizer');

console.log('🔧 Testing Fixes for Test 2 and Test 3\n');

// Test 2: Multiple emails
console.log('📧 Test 2: Multiple emails');
const test2Input = 'Contact John Doe at john@example.com or jane@test.org for more info';
console.log(`Input: ${test2Input}`);

anonymizer.clearMappings();
const test2Output = anonymizer.anonymizeMessage(test2Input);
console.log(`Output: ${test2Output}`);

// Check if John Doe is detected
const nameMatches = test2Input.match(anonymizer.PII_PATTERNS.name);
console.log(`Name matches: ${JSON.stringify(nameMatches)}`);

// Check email matches
const emailMatches = test2Input.match(anonymizer.PII_PATTERNS.email);
console.log(`Email matches: ${JSON.stringify(emailMatches)}`);

// Test deanonymization
const test2Restored = anonymizer.deanonymizeMessage(test2Output);
console.log(`Restored: ${test2Restored}`);
console.log(`Match: ${test2Input === test2Restored ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n' + '='.repeat(60) + '\n');

// Test 3: Different phone formats
console.log('📞 Test 3: Different phone formats');
const test3Input = 'Call me at 123-456-7890 or (555) 123-4567 or +1 800 555 0123';
console.log(`Input: ${test3Input}`);

anonymizer.clearMappings();
const test3Output = anonymizer.anonymizeMessage(test3Input);
console.log(`Output: ${test3Output}`);

// Check phone matches
const phoneMatches = test3Input.match(anonymizer.PII_PATTERNS.phone);
console.log(`Phone matches: ${JSON.stringify(phoneMatches)}`);

// Check mappings
console.log('\nPhone mappings:');
const mappings = anonymizer.getAllMappings();
for (const [token, mapping] of mappings) {
  if (mapping.type === 'phone') {
    console.log(`  ${token} → "${mapping.original}"`);
  }
}

// Test deanonymization
const test3Restored = anonymizer.deanonymizeMessage(test3Output);
console.log(`Restored: ${test3Restored}`);
console.log(`Match: ${test3Input === test3Restored ? '✅ PASS' : '❌ FAIL'}`);

if (test3Input !== test3Restored) {
  console.log('\nCharacter-by-character analysis:');
  const origChars = test3Input.split('');
  const restChars = test3Restored.split('');
  
  for (let i = 0; i < Math.max(origChars.length, restChars.length); i++) {
    const origChar = origChars[i] || '[MISSING]';
    const restChar = restChars[i] || '[MISSING]';
    if (origChar !== restChar) {
      console.log(`Position ${i}: "${origChar}" vs "${restChar}"`);
    }
  }
}

console.log('\n🎉 Test completed!');



