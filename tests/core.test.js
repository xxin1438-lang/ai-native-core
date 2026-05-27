// Core module tests
const assert = require('assert');
const { getProjectRoot, loadConfig, loadManifest } = require('../src/core/config');
const { detect, parseChat } = require('../src/core/detect');
const { loadAdapterRules } = require('../src/core/adapter');

// Config TOML parsing
function testTomlParsing() {
  const input = `
[project]
name = "test"
type = "backend"

[stack]
adapter = "backend-java"
package_manager = "maven"

[hooks]
enabled = true
cooldown = 1200
`;
  const config = require('../src/core/config');
  const result = config.parseSimpleToml(input);
  assert.strictEqual(result.project.name, 'test');
  assert.strictEqual(result.stack.adapter, 'backend-java');
  assert.strictEqual(result.stack.package_manager, 'maven');
  assert.strictEqual(result.hooks.enabled, true);
  assert.strictEqual(result.hooks.cooldown, 1200);
  console.log('  ✓ TOML parsing');
}

// Manifest YAML parsing
function testManifestParsing() {
  const yaml = `
factors:
  - name: design-foundation
    output_file: "design-foundation.md"
    max_items: 15
    source_globs:
      - "design/**/*.md"
    builtin_sources:
      - "adapters/{stack}/immutable-rules.md"
  - name: forbidden-patterns
    output_file: "forbidden-patterns.md"
    max_items: 25
`;
  const config = require('../src/core/config');
  const result = config.parseSimpleYaml(yaml);
  assert.strictEqual(result.factors.length, 2);
  assert.strictEqual(result.factors[0].name, 'design-foundation');
  assert.strictEqual(result.factors[0].max_items, 15);
  assert.deepStrictEqual(result.factors[0].source_globs, ['design/**/*.md']);
  console.log('  ✓ YAML parsing');
}

// Adapter rules
function testAdapterRules() {
  const rules = loadAdapterRules('react-spa');
  assert.ok(rules['forbidden-patterns']);
  assert.ok(rules['forbidden-patterns'].includes('DO NOT'));
  console.log('  ✓ Adapter react-spa');

  const javaRules = loadAdapterRules('backend-java');
  assert.ok(javaRules['forbidden-patterns']);
  assert.ok(javaRules['forbidden-patterns'].includes('DO NOT'));
  console.log('  ✓ Adapter backend-java');

  const nodeRules = loadAdapterRules('backend-node');
  assert.ok(nodeRules['forbidden-patterns']);
  console.log('  ✓ Adapter backend-node');
}

// Chat parsing
function testChatParsing() {
  let result = parseChat('Java backend, Spring Boot 3');
  assert.ok(result);
  assert.deepStrictEqual(result.stacks, ['backend-java']);

  result = parseChat('Node.js Express API');
  assert.ok(result);
  assert.deepStrictEqual(result.stacks, ['backend-node']);

  result = parseChat('React frontend with Python FastAPI backend');
  assert.ok(result);
  assert.ok(result.stacks.includes('react-spa'));
  assert.ok(result.stacks.includes('backend-python'));

  result = parseChat('random text');
  assert.strictEqual(result, null);
  console.log('  ✓ Chat parsing');
}

console.log('Core tests:\n');
testTomlParsing();
testManifestParsing();
testAdapterRules();
testChatParsing();
console.log('\n✅ All tests passed');
