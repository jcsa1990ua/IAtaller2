/**
 * Debug script to understand the phone format issue
 */

const anonymizer = require('./src/anonymizer');

console.log('🔍 Debugging Phone Format Issue\n');

const testInput = 'Call me at 123-456-7890 or (555) 123-4567 or +1 800 555 0123';
console.log(`Input: ${testInput}`);

// Check what the phone pattern matches
const phoneMatches = testInput.match(anonymizer.PII_PATTERNS.phone);
console.log(`Phone matches: ${JSON.stringify(phoneMatches)}`);

if (phoneMatches) {
  phoneMatches.forEach((match, index) => {
    console.log(`\nMatch ${index + 1}: "${match}"`);
    console.log(`  Length: ${match.length}`);
    console.log(`  Trimmed: "${match.trim()}"`);
    console.log(`  Cleaned (no +): "${match.replace(/[\s\-\(\)]/g, '')}"`);
    console.log(`  Cleaned (with +): "${match.replace(/[\s\-\(\)]/g, '')}"`);
    console.log(`  Leading spaces: "${match.match(/^\s*/)[0]}"`);
    console.log(`  Trailing spaces: "${match.match(/\s*$/)[0]}"`);
  });
}

// Test anonymization
console.log('\n🔒 Anonymization:');
anonymizer.clearMappings();
const anonymized = anonymizer.anonymizeMessage(testInput);
console.log(`Anonymized: ${anonymized}`);

// Check mappings
console.log('\n📊 Phone Mappings:');
const mappings = anonymizer.getAllMappings();
for (const [token, mapping] of mappings) {
  if (mapping.type === 'phone') {
    console.log(`  ${token} → "${mapping.original}"`);
  }
}

// Test deanonymization
console.log('\n🔓 Deanonymization:');
const restored = anonymizer.deanonymizeMessage(anonymized);
console.log(`Restored: ${restored}`);

console.log('\n🎉 Debug completed!');



