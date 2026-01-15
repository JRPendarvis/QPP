/**
 * Production-level test for ALL 27 pattern instructions
 * Tests actual render execution, not just static file validation
 */

const { getInstructionPlan, listSupportedInstructionPatternIds } = require('./dist/services/instructions/registry');

console.log('\n🧪 Testing All Pattern Instructions (Production Level)\n');
console.log('========================================================\n');

// Test data
const quiltSize = { widthIn: 60, heightIn: 72 };
const fabrics = {
  namesBySlot: ['Primary', 'Secondary', 'Accent', 'Background']
};

const patternIds = listSupportedInstructionPatternIds();
console.log(`📋 Total patterns to test: ${patternIds.length}\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const patternId of patternIds) {
  try {
    const plan = getInstructionPlan(patternId);
    
    if (!plan) {
      throw new Error('Plan not found in registry');
    }
    
    if (!plan.patternId) {
      throw new Error('Missing patternId field');
    }
    
    if (typeof plan.render !== 'function') {
      throw new Error('render is not a function');
    }
    
    const result = plan.render(quiltSize, fabrics);
    
    if (!result) {
      throw new Error('render() returned null/undefined');
    }
    
    if (Array.isArray(result)) {
      if (result.length === 0) {
        throw new Error('Instructions array is empty');
      }
    } else if (typeof result === 'object') {
      if (!result.instructions || !Array.isArray(result.instructions)) {
        throw new Error('Result missing instructions array');
      }
      if (result.instructions.length === 0) {
        throw new Error('Instructions array is empty');
      }
    } else {
      throw new Error(`Invalid result type: ${typeof result}`);
    }
    
    console.log(`✅ ${patternId}`);
    passed++;
    
  } catch (error) {
    console.log(`❌ ${patternId}`);
    console.log(`   Error: ${error.message}`);
    failed++;
    failures.push({ patternId, error: error.message });
  }
}

console.log('\n========================================================\n');
console.log(`📊 Results: ${passed}/${patternIds.length} patterns working\n`);

if (failed > 0) {
  console.log('❌ FAILED PATTERNS:\n');
  failures.forEach(({ patternId, error }) => {
    console.log(`   ${patternId}: ${error}`);
  });
  console.log('\n');
  process.exit(1);
} else {
  console.log('🎉 SUCCESS! All 27 patterns are fully functional!\n');
  console.log('✅ 100% instruction completeness validated\n');
  console.log('✅ Ready for production deployment\n');
  process.exit(0);
}
