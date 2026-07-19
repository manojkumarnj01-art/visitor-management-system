const fs = require('fs');

// 1. Check for unclosed HTML tags in index.html
const html = fs.readFileSync('index.html', 'utf8');

// 2. Check for corrupted UTF-8 sequences (multi-byte issues)
const corruptPatterns = [
  /Ã[\x80-\xBF]/g,  // Common UTF-8 double-encoding
  /Â[\x80-\xBF]/g,  // Another double-encoding pattern
  /\xEF\xBF\xBD/g,  // Replacement character U+FFFD
  /à®[^\x80-\xBF]/g, // Broken Tamil
];

let corruptFound = false;
corruptPatterns.forEach((pattern, i) => {
  const matches = html.match(pattern);
  if (matches && matches.length > 0) {
    console.log(`Corruption pattern ${i}: found ${matches.length} occurrences`);
    corruptFound = true;
  }
});
if (!corruptFound) console.log('No corrupted UTF-8 characters found in index.html');

// 3. Check that Tamil text (தமிழ்) is properly encoded
const tamilCheck = html.includes('தமிழ்');
console.log(`Tamil text (தமிழ்) properly encoded: ${tamilCheck}`);

// 4. Check for broken image/asset references in HTML
const imgSrcs = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
const localImgs = imgSrcs.filter(s => !s.startsWith('http') && !s.startsWith('data:'));
console.log('\nLocal image/src references:');
localImgs.forEach(src => {
  const path = src.startsWith('/') ? '.' + src : src;
  const exists = fs.existsSync(path);
  console.log(`  ${src} -> ${exists ? 'OK' : 'MISSING!'}`);
});

// 5. Check CSS link references
const cssRefs = [...html.matchAll(/href="([^"]+\.css)"/g)].map(m => m[1]);
console.log('\nCSS references:');
cssRefs.forEach(href => {
  if (href.startsWith('http')) { console.log(`  ${href} -> external`); return; }
  const path = href.startsWith('/') ? '.' + href : href;
  const exists = fs.existsSync(path);
  console.log(`  ${href} -> ${exists ? 'OK' : 'MISSING!'}`);
});

// 6. Check script references
const scriptSrcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);
console.log('\nScript references:');
scriptSrcs.forEach(src => {
  if (src.startsWith('http')) { console.log(`  ${src} -> external CDN`); return; }
  const path = src.startsWith('/') ? '.' + src : src;
  const exists = fs.existsSync(path);
  console.log(`  ${src} -> ${exists ? 'OK' : 'MISSING!'}`);
});

// 7. Check package.json validity
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\npackage.json: Valid JSON');
  console.log(`  name: ${pkg.name}`);
  console.log(`  version: ${pkg.version}`);
  console.log(`  build script: ${pkg.scripts?.build}`);
  
  // Check if dependencies are installed
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  let missingDeps = [];
  Object.keys(deps).forEach(dep => {
    if (!fs.existsSync(`node_modules/${dep}`)) {
      missingDeps.push(dep);
    }
  });
  if (missingDeps.length) {
    console.log(`  MISSING installed deps: ${missingDeps.join(', ')}`);
  } else {
    console.log('  All dependencies installed: OK');
  }
} catch (e) {
  console.log(`package.json: INVALID - ${e.message}`);
}

// 8. Check vercel.json
try {
  JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  console.log('\nvercel.json: Valid JSON');
} catch (e) {
  console.log(`\nvercel.json: INVALID - ${e.message}`);
}

// 9. Check firebase.json
try {
  JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  console.log('firebase.json: Valid JSON');
} catch (e) {
  console.log(`firebase.json: INVALID - ${e.message}`);
}

// 10. Check if Vite can find supabase.js
const supabaseExists = fs.existsSync('src/lib/supabase.js');
console.log(`\nsrc/lib/supabase.js exists: ${supabaseExists}`);

// 11. Check for common JS syntax issues in app.js
const appJs = fs.readFileSync('app.js', 'utf8');
try {
  // Basic check - try to parse for syntax
  new Function(appJs);
  console.log('app.js: No JavaScript syntax errors');
} catch (e) {
  console.log(`app.js: SYNTAX ERROR - ${e.message}`);
}

// 12. Check aiEngine.js
const aiJs = fs.readFileSync('aiEngine.js', 'utf8');
try {
  new Function(aiJs);
  console.log('aiEngine.js: No JavaScript syntax errors');
} catch (e) {
  console.log(`aiEngine.js: SYNTAX ERROR - ${e.message}`);
}

// 13. Check for logo.png in public
console.log(`\npublic/logo.png exists: ${fs.existsSync('public/logo.png')}`);
console.log(`logo.png (root) exists: ${fs.existsSync('logo.png')}`);

// 14. Verify Vercel build output directory
const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
console.log(`\nvercel.json rewrites: ${JSON.stringify(vercelJson.rewrites)}`);
// Check if "outputDirectory" or "buildCommand" is set
console.log(`vercel.json has outputDirectory: ${!!vercelJson.outputDirectory}`);
console.log(`vercel.json has buildCommand: ${!!vercelJson.buildCommand}`);
