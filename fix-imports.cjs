const fs = require('fs');
const path = require('path');

function fixImports(dir, depth) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath, depth);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix imports from parent directory
      content = content.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, "from '../../$1'");
      
      // Fix sibling imports that were modals and are now in components/modals
      content = content.replace(/from\s+['"]\.\/([^'"]+Modal)['"]/g, "from '../../components/modals/$1'");
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixImports(path.join(__dirname, 'src', 'features'), 2);
fixImports(path.join(__dirname, 'src', 'components', 'modals'), 2);

console.log("Imports fixed!");
