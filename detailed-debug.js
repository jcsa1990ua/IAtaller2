/**
 * Detailed debugging script to trace anonymization/deanonymization issues
 */

const anonymizer = require('./src/anonymizer');

console.log('🔍 Detailed Debugging - Anonymization/Deanonymization Mismatch\n');

// Clear mappings
anonymizer.clearMappings();

// Test with the exact example from the user
const originalMessage = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
console.log('📝 Original Message:');
console.log(`"${originalMessage}"\n`);

// Step 1: Check what PII is detected
console.log('🔍 Step 1: PII Detection');
const detectedPII = anonymizer.detectPII(originalMessage);
console.log('Detected PII:', detectedPII);

// Step 2: Check individual patterns
console.log('\n🔍 Step 2: Individual Pattern Testing');

// Test email pattern
const emailMatches = originalMessage.match(anonymizer.PII_PATTERNS.email);
console.log(`Email pattern matches: ${JSON.stringify(emailMatches)}`);

// Test phone pattern
const phoneMatches = originalMessage.match(anonymizer.PII_PATTERNS.phone);
console.log(`Phone pattern matches: ${JSON.stringify(phoneMatches)}`);

// Test name pattern
const nameMatches = originalMessage.match(anonymizer.PII_PATTERNS.name);
console.log(`Name pattern matches: ${JSON.stringify(nameMatches)}`);

// Step 3: Test individual anonymization functions
console.log('\n🔍 Step 3: Individual Anonymization Functions');

let stepByStep = originalMessage;
console.log(`Starting with: "${stepByStep}"`);

// Anonymize emails
stepByStep = stepByStep.replace(anonymizer.PII_PATTERNS.email, (email) => {
  const token = anonymizer.generateToken(email, 'email');
  console.log(`Email "${email}" → "${token}"`);
  return token;
});
console.log(`After email anonymization: "${stepByStep}"`);

// Anonymize phones
stepByStep = stepByStep.replace(anonymizer.PII_PATTERNS.phone, (phone) => {
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  const token = anonymizer.generateToken(cleanPhone, 'phone');
  console.log(`Phone "${phone}" (cleaned: "${cleanPhone}") → "${token}"`);
  return token;
});
console.log(`After phone anonymization: "${stepByStep}"`);

// Anonymize names
stepByStep = stepByStep.replace(anonymizer.PII_PATTERNS.name, (name) => {
  const nameParts = name.split(/\s+/);
  const tokens = nameParts.map(part => {
    const token = anonymizer.generateToken(part, 'name');
    console.log(`Name part "${part}" → "${token}"`);
    return token;
  });
  return tokens.join(' ');
});
console.log(`After name anonymization: "${stepByStep}"`);

// Step 4: Compare with full anonymization
console.log('\n🔍 Step 4: Full Anonymization Comparison');
const fullAnonymized = anonymizer.anonymizeMessage(originalMessage);
console.log(`Full anonymization result: "${fullAnonymized}"`);
console.log(`Step-by-step result: "${stepByStep}"`);
console.log(`Match: ${fullAnonymized === stepByStep ? '✅' : '❌'}`);

// Step 5: Check mappings
console.log('\n🔍 Step 5: Token Mappings');
const mappings = anonymizer.getAllMappings();
console.log('All mappings:');
for (const [token, mapping] of mappings) {
  console.log(`  ${token} → "${mapping.original}" (${mapping.type})`);
}

// Step 6: Test deanonymization
console.log('\n🔍 Step 6: Deanonymization Process');
const anonymizedMessage = fullAnonymized;
console.log(`Anonymized message: "${anonymizedMessage}"`);

// Check what tokens are found
const tokenMatches = anonymizedMessage.match(anonymizer.TOKEN_PATTERNS.token);
console.log(`Tokens found in message: ${JSON.stringify(tokenMatches)}`);

// Test deanonymization
const restoredMessage = anonymizer.deanonymizeMessage(anonymizedMessage);
console.log(`Restored message: "${restoredMessage}"`);

// Step 7: Final comparison
console.log('\n🔍 Step 7: Final Comparison');
console.log(`Original:  "${originalMessage}"`);
console.log(`Restored:  "${restoredMessage}"`);
console.log(`Match: ${originalMessage === restoredMessage ? '✅ PASS' : '❌ FAIL'}`);

// Step 8: Character-by-character comparison if they don't match
if (originalMessage !== restoredMessage) {
  console.log('\n🔍 Step 8: Character-by-Character Analysis');
  const originalChars = originalMessage.split('');
  const restoredChars = restoredMessage.split('');
  
  console.log(`Original length: ${originalChars.length}`);
  console.log(`Restored length: ${restoredChars.length}`);
  
  for (let i = 0; i < Math.max(originalChars.length, restoredChars.length); i++) {
    const origChar = originalChars[i] || '[MISSING]';
    const restChar = restoredChars[i] || '[MISSING]';
    if (origChar !== restChar) {
      console.log(`Position ${i}: Original="${origChar}" Restored="${restChar}"`);
    }
  }
}

console.log('\n✅ Debugging completed!');


