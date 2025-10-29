/**
 * Final test to verify all fixes
 */

const anonymizer = require('./src/anonymizer');

console.log('🎯 Final Test - All Fixes Applied\n');

// Clear mappings
anonymizer.clearMappings();

// Test the exact example from the user
const testMessage = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
console.log(`📝 Original Message:`);
console.log(`"${testMessage}"\n`);

// Step-by-step anonymization to see the process
console.log('🔍 Step-by-Step Anonymization:');

let stepByStep = testMessage;
console.log(`Starting: "${stepByStep}"`);

// Step 1: Phones first
stepByStep = stepByStep.replace(anonymizer.PII_PATTERNS.phone, (phone) => {
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  const token = anonymizer.generateToken(cleanPhone, 'phone', phone);
  console.log(`Phone "${phone}" (cleaned: "${cleanPhone}") → "${token}"`);
  return token;
});
console.log(`After phones: "${stepByStep}"`);

// Step 2: Emails
stepByStep = stepByStep.replace(anonymizer.PII_PATTERNS.email, (email) => {
  const token = anonymizer.generateToken(email, 'email');
  console.log(`Email "${email}" → "${token}"`);
  return token;
});
console.log(`After emails: "${stepByStep}"`);

// Step 3: Names
stepByStep = stepByStep.replace(anonymizer.PII_PATTERNS.name, (name) => {
  const nameParts = name.split(/\s+/);
  const tokens = nameParts.map(part => {
    const token = anonymizer.generateToken(part, 'name');
    console.log(`Name part "${part}" → "${token}"`);
    return token;
  });
  return tokens.join(' ');
});
console.log(`After names: "${stepByStep}"`);

// Compare with full anonymization
console.log('\n🔄 Full Anonymization:');
const fullAnonymized = anonymizer.anonymizeMessage(testMessage);
console.log(`Result: "${fullAnonymized}"`);
console.log(`Match: ${stepByStep === fullAnonymized ? '✅' : '❌'}`);

// Check mappings
console.log('\n📊 Token Mappings:');
const mappings = anonymizer.getAllMappings();
const phoneMappings = [];
const emailMappings = [];
const nameMappings = [];

for (const [token, mapping] of mappings) {
  console.log(`  ${token} → "${mapping.original}" (${mapping.type})`);
  if (mapping.type === 'phone') phoneMappings.push([token, mapping]);
  if (mapping.type === 'email') emailMappings.push([token, mapping]);
  if (mapping.type === 'name') nameMappings.push([token, mapping]);
}

console.log(`\n📈 Summary:`);
console.log(`  Phone mappings: ${phoneMappings.length} (should be 1)`);
console.log(`  Email mappings: ${emailMappings.length} (should be 1)`);
console.log(`  Name mappings: ${nameMappings.length} (should be 2)`);

// Test token detection
console.log('\n🔍 Token Detection:');
const tokenMatches = fullAnonymized.match(anonymizer.TOKEN_PATTERNS.token);
console.log(`Tokens found: ${JSON.stringify(tokenMatches)}`);
console.log(`Expected tokens: ${phoneMappings.length + emailMappings.length + nameMappings.length}`);

// Test deanonymization
console.log('\n🔓 Deanonymization:');
const restored = anonymizer.deanonymizeMessage(fullAnonymized);
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

console.log('\n🎉 Test completed!');


