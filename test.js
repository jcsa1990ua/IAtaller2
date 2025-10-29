/**
 * Test file for the Data Privacy Vault
 * 
 * This file contains tests to verify both anonymization and deanonymization functionality
 */

const anonymizer = require('./src/anonymizer');

// Test cases for anonymization
const anonymizationTestCases = [
  {
    name: 'Basic PII anonymization',
    input: 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157',
    expectedPattern: /oferta de trabajo para NAME_[a-f0-9]{8} NAME_[a-f0-9]{8} con email EMAIL_[a-f0-9]{8} y teléfono PHONE_[a-f0-9]{8}/
  },
  {
    name: 'Multiple emails',
    input: 'Contact John Doe at john@example.com or jane@test.org for more info',
    expectedPattern: /Contact NAME_[a-f0-9]{8} NAME_[a-f0-9]{8} at EMAIL_[a-f0-9]{8} or EMAIL_[a-f0-9]{8} for more info/
  },
  {
    name: 'Different phone formats',
    input: 'Call me at 123-456-7890 or (555) 123-4567 or +1 800 555 0123',
    expectedPattern: /Call me at PHONE_[a-f0-9]{8} or PHONE_[a-f0-9]{8} or PHONE_[a-f0-9]{8}/
  },
  {
    name: 'Spanish names',
    input: 'María José González contactó a Juan Carlos Pérez',
    expectedPattern: /NAME_[a-f0-9]{8} NAME_[a-f0-9]{8} NAME_[a-f0-9]{8} contactó a NAME_[a-f0-9]{8} NAME_[a-f0-9]{8} NAME_[a-f0-9]{8}/
  }
];

// Test cases for deanonymization (will be populated dynamically)
let deanonymizationTestCases = [];

console.log('🧪 Running Data Privacy Vault Tests...\n');

// Clear any existing mappings before testing
anonymizer.clearMappings();

console.log('📝 Testing Anonymization...\n');

// Run anonymization tests
anonymizationTestCases.forEach((testCase, index) => {
  try {
    const result = anonymizer.anonymizeMessage(testCase.input);
    const matches = testCase.expectedPattern.test(result);
    
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Input:    ${testCase.input}`);
    console.log(`Output:   ${result}`);
    console.log(`Status:   ${matches ? '✅ PASS' : '❌ FAIL'}`);
    console.log('---');
  } catch (error) {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Status:   ❌ ERROR - ${error.message}`);
    console.log('---');
  }
});

console.log('\n🔓 Testing Deanonymization...\n');

// Create deanonymization test cases from anonymization results
const testMessage = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
const anonymizedTestMessage = anonymizer.anonymizeMessage(testMessage);

deanonymizationTestCases = [
  {
    name: 'Basic deanonymization',
    input: anonymizedTestMessage,
    original: testMessage
  }
];

// Run deanonymization tests
deanonymizationTestCases.forEach((testCase, index) => {
  try {
    const result = anonymizer.deanonymizeMessage(testCase.input);
    const matches = result === testCase.original;
    
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Input:    ${testCase.input}`);
    console.log(`Output:   ${result}`);
    console.log(`Expected: ${testCase.original}`);
    console.log(`Status:   ${matches ? '✅ PASS' : '❌ FAIL'}`);
    console.log('---');
  } catch (error) {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Status:   ❌ ERROR - ${error.message}`);
    console.log('---');
  }
});

// Test complete anonymize/deanonymize flow
console.log('\n🔄 Testing Complete Flow (Anonymize → Deanonymize)...\n');

try {
  const originalMessage = 'Contact María González at maria@example.com or call 555-123-4567';
  console.log(`Original:  ${originalMessage}`);
  
  // Anonymize
  const anonymized = anonymizer.anonymizeMessage(originalMessage);
  console.log(`Anonymized: ${anonymized}`);
  
  // Deanonymize
  const restored = anonymizer.deanonymizeMessage(anonymized);
  console.log(`Restored:   ${restored}`);
  
  const flowSuccess = originalMessage === restored;
  console.log(`Status:     ${flowSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
} catch (error) {
  console.log(`Status:     ❌ ERROR - ${error.message}`);
}

// Test PII detection
console.log('\n🔍 Testing PII Detection...');
const piiTestMessage = 'Contact María González at maria@example.com or call 555-123-4567';
const detected = anonymizer.detectPII(piiTestMessage);
console.log(`Input: ${piiTestMessage}`);
console.log(`Detected PII:`, detected);

// Test mapping statistics
console.log('\n📊 Mapping Statistics...');
const stats = anonymizer.getMappingStats();
console.log(`Total mappings: ${stats.total}`);
console.log(`By type:`, stats.byType);

console.log('\n✅ All tests completed!');
