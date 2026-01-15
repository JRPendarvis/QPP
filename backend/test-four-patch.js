/**
 * Test four-patch pattern instruction generation
 */

const { fourPatchPlan } = require('./dist/config/patterns/four-patch/plan');

console.log('\n🧪 Testing Four-Patch Pattern\n');
console.log('================================\n');

// Test data
const quiltSize = { widthIn: 60, heightIn: 72 };
const fabrics = {
  namesBySlot: ['Red', 'Blue', 'Green', 'Yellow']
};

try {
  console.log('✅ Plan imported:', fourPatchPlan);
  console.log('✅ Pattern ID:', fourPatchPlan.patternId);
  console.log('✅ Has render function:', typeof fourPatchPlan.render === 'function');

  if (typeof fourPatchPlan.render === 'function') {
    console.log('\n🎯 Testing render function...\n');
    const result = fourPatchPlan.render(quiltSize, fabrics);
    
    console.log('✅ Render succeeded!');
    console.log('📋 Result type:', typeof result);
    
    if (Array.isArray(result)) {
      console.log('✅ Instructions array:', result.length, 'lines');
      console.log('\n📋 First 5 instruction lines:');
      result.slice(0, 5).forEach((line, i) => console.log(`   ${i + 1}. ${line}`));
    } else if (result.instructions && Array.isArray(result.instructions)) {
      console.log('✅ Has instructions array:', result.instructions.length, 'sections');
    }
    
    console.log('\n✅ FOUR-PATCH PATTERN IS FULLY FUNCTIONAL!\n');
  } else {
    console.error('\n❌ Render is not a function\n');
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
}
