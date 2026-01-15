/**
 * Validation script to ensure all pattern instructions are complete and valid
 * Run with: node validate-instructions.js
 */

const fs = require('fs');
const path = require('path');

const PATTERNS_DIR = path.join(__dirname, 'src', 'config', 'patterns');
const REGISTRY_FILE = path.join(__dirname, 'src', 'services', 'instructions', 'registry.ts');

// Expected patterns from registry
const EXPECTED_PATTERNS = [
  'pinwheel',
  'bow-tie',
  'checkerboard',
  'churn-dash',
  'complex-medallion',
  'double-wedding-ring',
  'drunkards-path',
  'feathered-star',
  'flying-geese',
  'four-patch',
  'grandmothers-flower-garden',
  'half-square-triangles',
  'hourglass',
  'kaleidoscope-star',
  'log-cabin',
  'lone-star',
  'mariners-compass',
  'mosaic-star',
  'new-york-beauty',
  'nine-patch',
  'ohio-star',
  'pickle-dish',
  'rail-fence',
  'sawtooth-star',
  'simple-squares',
  'storm-at-sea',
  'strip-quilt',
];

console.log('🔍 Validating Pattern Instructions\n');
console.log('=' .repeat(60));

let allValid = true;
const results = [];

for (const patternId of EXPECTED_PATTERNS) {
  const patternDir = path.join(PATTERNS_DIR, patternId);
  const planFile = path.join(patternDir, 'plan.ts');
  const renderFile = path.join(patternDir, 'renderInstructions.ts');
  
  const result = {
    patternId,
    exists: false,
    hasPlan: false,
    hasRender: false,
    planValid: false,
    renderValid: false,
    errors: [],
  };

  // Check if pattern directory exists
  if (!fs.existsSync(patternDir)) {
    result.errors.push('❌ Pattern directory not found');
    results.push(result);
    allValid = false;
    continue;
  }
  result.exists = true;

  // Check plan.ts
  if (!fs.existsSync(planFile)) {
    result.errors.push('❌ plan.ts not found');
    allValid = false;
  } else {
    result.hasPlan = true;
    const planContent = fs.readFileSync(planFile, 'utf8');
    
    // Validate plan structure
    const hasPatternId = planContent.includes(`patternId: '${patternId}'`);
    const hasRenderFunction = planContent.includes('render:');
    const hasImport = planContent.includes('InstructionPlan');
    
    if (!hasPatternId) result.errors.push('⚠️  Missing patternId in plan');
    if (!hasRenderFunction) result.errors.push('⚠️  Missing render function in plan');
    if (!hasImport) result.errors.push('⚠️  Missing InstructionPlan import');
    
    result.planValid = hasPatternId && hasRenderFunction && hasImport;
    if (!result.planValid) allValid = false;
  }

  // Check renderInstructions.ts
  if (!fs.existsSync(renderFile)) {
    result.errors.push('❌ renderInstructions.ts not found');
    allValid = false;
  } else {
    result.hasRender = true;
    const renderContent = fs.readFileSync(renderFile, 'utf8');
    
    // Validate render structure
    const hasExport = renderContent.includes('export function renderInstructions');
    const hasDisclaimer = renderContent.includes('DISCLAIMER') || renderContent.includes('📌 IMPORTANT');
    const hasReturnStatement = renderContent.includes('return lines');
    const hasQuiltSizeParam = renderContent.includes('quiltSize: QuiltSizeIn');
    const hasFabricsParam = renderContent.includes('fabrics: FabricAssignments');
    
    if (!hasExport) result.errors.push('⚠️  Missing renderInstructions export');
    if (!hasDisclaimer) result.errors.push('⚠️  Missing disclaimer message');
    if (!hasReturnStatement) result.errors.push('⚠️  Missing return statement');
    if (!hasQuiltSizeParam) result.errors.push('⚠️  Missing quiltSize parameter');
    if (!hasFabricsParam) result.errors.push('⚠️  Missing fabrics parameter');
    
    result.renderValid = hasExport && hasDisclaimer && hasReturnStatement && hasQuiltSizeParam && hasFabricsParam;
    if (!result.renderValid) allValid = false;
  }

  results.push(result);
}

// Print results
console.log('\n📊 Validation Results:\n');

for (const result of results) {
  const status = result.planValid && result.renderValid ? '✅' : '❌';
  console.log(`${status} ${result.patternId}`);
  
  if (result.exists) {
    console.log(`   Plan: ${result.planValid ? '✅' : '❌'}`);
    console.log(`   Render: ${result.renderValid ? '✅' : '❌'}`);
  }
  
  if (result.errors.length > 0) {
    result.errors.forEach(err => console.log(`   ${err}`));
  }
  console.log('');
}

// Summary
console.log('=' .repeat(60));
const validCount = results.filter(r => r.planValid && r.renderValid).length;
const totalCount = results.length;

console.log(`\n📈 Summary: ${validCount}/${totalCount} patterns valid`);

if (allValid) {
  console.log('\n✅ ALL PATTERNS VALIDATED SUCCESSFULLY!\n');
  process.exit(0);
} else {
  console.log('\n❌ VALIDATION FAILED - Please fix the issues above\n');
  process.exit(1);
}
