const fs = require('fs');

// Deep HTML structure analysis
const html = fs.readFileSync('index.html', 'utf8');

// 1. Count opening and closing tags for critical elements
const tags = ['div', 'section', 'form', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'select', 'option', 'button', 'span', 'main', 'aside', 'header', 'nav', 'ul', 'li'];

console.log('=== HTML Tag Balance Check ===\n');
tags.forEach(tag => {
  // Self-closing tags like <input/>, <br/>, <img/> should be excluded
  const openRegex = new RegExp(`<${tag}[\\s>]`, 'gi');
  const closeRegex = new RegExp(`</${tag}>`, 'gi');
  const openCount = (html.match(openRegex) || []).length;
  const closeCount = (html.match(closeRegex) || []).length;
  const status = openCount === closeCount ? 'OK' : 'MISMATCH!';
  if (openCount !== closeCount) {
    console.log(`  <${tag}>: open=${openCount}, close=${closeCount} - ${status}`);
  }
});
console.log('  (Only mismatches shown above. No output = all balanced.)');

// 2. Check for common Vite/build issues
console.log('\n=== Vite Build Checks ===\n');

// Check if there's a vite.config.js
console.log(`  vite.config.js exists: ${fs.existsSync('vite.config.js')}`);
console.log(`  vite.config.ts exists: ${fs.existsSync('vite.config.ts')}`);

// 3. Check for circular imports (only relevant for the module)
console.log('\n=== Module Import Chain ===\n');
const supabase = fs.readFileSync('src/lib/supabase.js', 'utf8');
const imports = supabase.match(/import.*from.*/g) || [];
console.log('  supabase.js imports:', imports);

// 4. Check if app.js and aiEngine.js reference each other
const appJs = fs.readFileSync('app.js', 'utf8');
const aiJs = fs.readFileSync('aiEngine.js', 'utf8');
console.log(`\n  app.js references aiEngine: ${appJs.includes('VmsAiEngine') || appJs.includes('aiEngine')}`);
console.log(`  aiEngine.js references app: ${aiJs.includes('app.js')}`);

// 5. Check for window.supabase usage in app.js
console.log(`\n  app.js uses window.supabaseClient: ${appJs.includes('window.supabaseClient')}`);
console.log(`  app.js uses window.supabase: ${appJs.includes('window.supabase')}`);

// 6. CSS validation - check for unclosed braces
const css = fs.readFileSync('styles.css', 'utf8');
let braceCount = 0;
for (const char of css) {
  if (char === '{') braceCount++;
  if (char === '}') braceCount--;
}
console.log(`\n=== CSS Brace Balance ===`);
console.log(`  Brace balance (should be 0): ${braceCount}`);

// 7. Check .firebaserc
try {
  const fbrc = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));
  console.log(`\n.firebaserc: Valid JSON - project: ${fbrc.projects?.default}`);
} catch(e) {
  console.log(`\n.firebaserc: INVALID - ${e.message}`);
}

// 8. Verify Vercel deployment requirements  
console.log('\n=== Vercel Deployment Compatibility ===');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
console.log(`  Has framework detection override: ${!!vercel.framework}`);
console.log(`  Has buildCommand: ${!!vercel.buildCommand}`);
console.log(`  Has outputDirectory: ${!!vercel.outputDirectory}`);
console.log(`  Has rewrites: ${!!vercel.rewrites}`);
// Note: Vercel auto-detects Vite via package.json scripts

// 9. Check for potential runtime errors - undefined references in app.js
const potentialIssues = [];
// Check for getElementById calls that reference non-existent IDs
const getByIdCalls = appJs.match(/getElementById\(['"]([^'"]+)['"]\)/g) || [];
console.log(`\n=== app.js getElementById calls ===`);
console.log(`  Total getElementById calls: ${getByIdCalls.length}`);

// 10. File size warnings
console.log('\n=== File Size Analysis ===');
console.log(`  index.html: ${(fs.statSync('index.html').size / 1024).toFixed(1)} KB`);
console.log(`  app.js: ${(fs.statSync('app.js').size / 1024).toFixed(1)} KB`);
console.log(`  aiEngine.js: ${(fs.statSync('aiEngine.js').size / 1024).toFixed(1)} KB`);
console.log(`  styles.css: ${(fs.statSync('styles.css').size / 1024).toFixed(1)} KB`);
console.log(`  logo.png: ${(fs.statSync('logo.png').size / 1024).toFixed(1)} KB`);

console.log('\n=== AUDIT COMPLETE ===');
