// config reader

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getProjectRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
  } catch {
    return process.cwd();
  }
}

function loadConfig(projectRoot) {
  const configPath = path.join(projectRoot, '.ai-native', 'config.toml');
  if (!fs.existsSync(configPath)) {
    return getDefaultConfig();
  }
  return parseSimpleToml(fs.readFileSync(configPath, 'utf-8'));
}

function getDefaultConfig() {
  return {
    project: { name: 'unknown', type: 'frontend' },
    stack: { adapter: 'react-spa', package_manager: 'pnpm' },
    paradigm: { watch_paths: [] },
    hooks: { enabled: true, reminder_cooldown_sec: 1200 },
    sdd: { enforced: true },
    onboarding: { demo_enabled: false },
    distiller: { manifest: '.ai-native/memory/MANIFEST.yaml', output_dir: '.ai-native/memory/' },
  };
}

function parseSimpleToml(content) {
  const config = getDefaultConfig();
  const lines = content.split('\n');
  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const sectionMatch = trimmed.match(/^\[(.+?)\]/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }

    const kvMatch = trimmed.match(/^(\S+)\s*=\s*(.+)/);
    if (kvMatch && currentSection) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();

      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (/^\d+$/.test(value)) value = parseInt(value);
      else if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      else if (value.startsWith('[')) {
        try { value = JSON.parse(value); } catch { value = [value]; }
      }

      const parts = currentSection.split('.');
      let obj = config;
      for (const part of parts) {
        if (!obj[part]) obj[part] = {};
        obj = obj[part];
      }
      if (Array.isArray(obj)) {
        obj.push(value);
      } else {
        obj[key] = value;
      }
    }
  }
  return config;
}

function loadManifest(projectRoot) {
  const config = loadConfig(projectRoot);
  const manifestPath = path.join(projectRoot, config.distiller?.manifest || '.ai-native/memory/MANIFEST.yaml');
  if (!fs.existsSync(manifestPath)) {
    return { factors: [] };
  }
  const content = fs.readFileSync(manifestPath, 'utf-8');
  return parseSimpleYaml(content);
}

function parseSimpleYaml(content) {
  const result = { factors: [] };
  const lines = content.split('\n');
  let inFactors = false;
  let currentFactor = null;
  let inBuiltinSources = false;
  let collectingList = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed === 'factors:') { inFactors = true; continue; }

    if (inFactors) {
      if (trimmed.startsWith('- name:')) {
        if (currentFactor) result.factors.push(currentFactor);
        currentFactor = { name: trimmed.replace('- name:', '').trim(), source_globs: [], builtin_sources: [] };
        collectingList = null;
        inBuiltinSources = false;
      } else if (currentFactor) {
        if (trimmed.startsWith('source_globs:')) {
          collectingList = 'source_globs';
          const value = trimmed.replace('source_globs:', '').trim();
          if (value && value !== '[]') currentFactor.source_globs.push(value.replace(/^- /, '').replace(/"/g, ''));
        } else if (trimmed.startsWith('builtin_sources:')) {
          collectingList = 'builtin_sources';
          inBuiltinSources = true;
          const value = trimmed.replace('builtin_sources:', '').trim();
          if (value && value !== '[]') currentFactor.builtin_sources.push(value.replace(/^- /, '').replace(/"/g, ''));
        } else if (trimmed.startsWith('- ') && collectingList) {
          const value = trimmed.replace(/^- /, '').replace(/"/g, '');
          currentFactor[collectingList].push(value);
        } else if (trimmed.includes(':')) {
          const [k, v] = trimmed.split(':').map(s => s.trim());
          if (k === 'output_file') currentFactor.output_file = v.replace(/"/g, '');
          else if (k === 'max_items') currentFactor.max_items = parseInt(v);
          else if (k === 'priority') currentFactor.priority = v;
          else if (k === 'description') currentFactor.description = v;
          collectingList = null;
        }
      }
    }
  }
  if (currentFactor) result.factors.push(currentFactor);
  return result;
}

module.exports = { getProjectRoot, loadConfig, loadManifest, parseSimpleToml, parseSimpleYaml };
