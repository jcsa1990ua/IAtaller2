/**
 * Demonstration script for Data Privacy Vault
 * 
 * This script demonstrates the complete anonymize/deanonymize workflow
 */

const anonymizer = require('./src/anonymizer');

console.log('🔐 Data Privacy Vault - Complete Workflow Demo\n');

// Clear any existing mappings
anonymizer.clearMappings();

// Example message with PII
const originalMessage = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';

console.log('📝 Step 1: Original Message');
console.log(`"${originalMessage}"\n`);

console.log('🔒 Step 2: Anonymizing PII...');
const anonymizedMessage = anonymizer.anonymizeMessage(originalMessage);
console.log(`"${anonymizedMessage}"\n`);

// Check token detection
console.log('🔍 Token Detection:');
const tokenMatches = anonymizedMessage.match(anonymizer.TOKEN_PATTERNS.token);
console.log(`Tokens found: ${JSON.stringify(tokenMatches)}`);
console.log('');

console.log('🔓 Step 3: Deanonymizing (restoring original)...');
const restoredMessage = anonymizer.deanonymizeMessage(anonymizedMessage);
console.log(`"${restoredMessage}"\n`);

console.log('✅ Step 4: Verification');
const isMatch = originalMessage === restoredMessage;
console.log(`Original and restored messages match: ${isMatch ? '✅ YES' : '❌ NO'}\n`);

console.log('📊 Step 5: Mapping Statistics');
const stats = anonymizer.getMappingStats();
console.log(`Total mappings stored: ${stats.total}`);
console.log(`By type:`, stats.byType);
console.log('');

console.log('🔍 Step 6: Individual Token Mappings');
const mappings = anonymizer.getAllMappings();
for (const [token, mapping] of mappings) {
  console.log(`${token} → "${mapping.original}" (${mapping.type})`);
}

console.log('\n🎉 Demo completed successfully!');
