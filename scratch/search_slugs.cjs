const fs = require('fs');
const path = require('path');

const slugs = [
  'carrot',
  'tulsi-holy-basil-leaf-powder',
  'kasuri-methi-powder',
  'coriander-leaf-powder',
  'curry-leaf-powder',
  'moringa-seed-powder',
  'black-pepper',
  'fenugreek-seeds',
  'cloves',
  'coriander-seeds',
  'fennel-seeds',
  'green-cardamom',
  'mustard-seeds',
  'star-anise',
  'bay-leaf',
  'garam-masala'
];

function search(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.output') search(full);
    } else if (/\.(ts|tsx|json|html|css)$/.test(f)) {
      const content = fs.readFileSync(full, 'utf8');
      slugs.forEach(s => {
        if (content.includes(s)) {
          console.log(`${full} mentions ${s}`);
        }
      });
    }
  }
}

search('src');
