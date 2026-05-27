// adapter loader

const fs = require('fs');
const path = require('path');

function loadAdapterRules(adapterName) {
  const rules = {};

  // Try loading from npm package first, then from local adapters/
  const adapterDir = path.join(__dirname, '..', '..', 'adapters', adapterName);
  const immutablePath = path.join(adapterDir, 'immutable-rules.md');

  if (fs.existsSync(immutablePath)) {
    const content = fs.readFileSync(immutablePath, 'utf-8');
    // Parse sections: each ## heading becomes a rule group, each "- " line is a rule
    const sections = content.split('\n## ');
    for (const section of sections) {
      if (!section.trim()) continue;
      const lines = section.split('\n');
      const heading = lines[0]?.replace(/^## /, '').trim();
      if (heading && heading.includes('不可变')) {
        // This is a forbidden-patterns section
        rules['forbidden-patterns'] = (rules['forbidden-patterns'] || '') +
          '\n' + lines.filter(l => l.startsWith('- ')).join('\n');
      }
    }
  }

  return rules;
}

module.exports = { loadAdapterRules };
