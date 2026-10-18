const fs = require('fs');
const path = require('path');

const targets = [
  'carrot',
  'tulsi',
  'fenugreek',
  'coriander',
  'curry leaf',
  'curry-leaf',
  'moringa seed',
  'moringa-seed',
  'black pepper',
  'black-pepper',
  'clove',
  'fennel',
  'cardamom',
  'mustard',
  'star anise',
  'star-anise',
  'bay leaf',
  'bay-leaf',
  'tejpatta',
  'garam masala',
  'garam-masala'
];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.output') {
        searchDir(full);
      }
    } else if (/\.(ts|tsx|js|json)$/.test(f)) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = [];
      targets.forEach(t => {
        if (content.toLowerCase().includes(t)) {
          matches.push(t);
        }
      });
      if (matches.length > 0) {
        console.log(`${full}: matches [${matches.join(', ')}]`);
      }
    }
  }
}

searchDir('src');
