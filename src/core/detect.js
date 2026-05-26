// ai-native project detection

const fs = require('fs');
const path = require('path');

function detect(root) {
  const result = { stacks: [], lang: null, framework: null, build: null, pm: 'pnpm' };

  // Java
  const pomXml = path.join(root, 'pom.xml');
  if (fs.existsSync(pomXml)) {
    const content = fs.readFileSync(pomXml, 'utf-8');
    const javaMatch = content.match(/<java\.version>(\d+)<\/java\.version>/) || content.match(/<maven\.compiler\.source>(\d+)<\/maven\.compiler\.source>/);
    const sbMatch = content.match(/spring-boot-starter-parent.*?<version>([\d.]+)<\/version>/s);
    result.lang = javaMatch ? `Java ${javaMatch[1]}` : 'Java';
    result.framework = sbMatch ? `Spring Boot ${sbMatch[1]}` : (content.includes('quarkus') ? 'Quarkus' : 'Spring Boot');
    result.build = 'Maven';
    result.stacks.push('backend-java');
    return result;
  }

  const buildGradle = path.join(root, 'build.gradle') || path.join(root, 'build.gradle.kts');
  if (fs.existsSync(path.join(root, 'build.gradle'))) {
    result.lang = 'Java/Kotlin';
    result.framework = 'Spring Boot';
    result.build = 'Gradle';
    result.stacks.push('backend-java');
    return result;
  }

  // Go
  if (fs.existsSync(path.join(root, 'go.mod'))) {
    const content = fs.readFileSync(path.join(root, 'go.mod'), 'utf-8');
    const goMatch = content.match(/go (\d+\.\d+)/);
    result.lang = goMatch ? `Go ${goMatch[1]}` : 'Go';
    result.build = 'go mod';
    result.stacks.push('backend-go');
    return result;
  }

  // Python
  if (fs.existsSync(path.join(root, 'pyproject.toml'))) {
    result.lang = 'Python';
    result.build = 'pip/poetry';
    result.stacks.push('backend-python');
    return result;
  }

  // Node.js
  const pkgJson = path.join(root, 'package.json');
  if (fs.existsSync(pkgJson)) {
    const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf-8'));
    result.lang = 'Node.js';
    result.pm = fs.existsSync(path.join(root, 'pnpm-lock.yaml')) ? 'pnpm' :
                fs.existsSync(path.join(root, 'yarn.lock')) ? 'yarn' :
                fs.existsSync(path.join(root, 'bun.lockb')) ? 'bun' : 'npm';

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps.next) { result.stacks.push('nextjs'); result.framework = 'Next.js'; }
    else if (deps.vue) { result.stacks.push('vue'); result.framework = 'Vue'; }
    else if (deps.react) { result.stacks.push('react-spa'); result.framework = 'React'; }

    result.build = 'npm/pnpm';
    return result;
  }

  return null;
}

function parseChat(input) {
  const lower = input.toLowerCase();
  const result = { stacks: [], pm: 'pnpm' };

  // Backend detection
  if (lower.includes('java') || lower.includes('spring')) {
    result.stacks.push('backend-java');
    result.type = 'backend';
  } else if (lower.includes('go') || lower.includes('golang')) {
    result.stacks.push('backend-go');
    result.type = 'backend';
  } else if (lower.includes('python') || lower.includes('fastapi') || lower.includes('django') || lower.includes('flask')) {
    result.stacks.push('backend-python');
    result.type = 'backend';
  }

  // Frontend detection
  if (lower.includes('react') && !lower.includes('next')) {
    result.stacks.push('react-spa');
    if (!result.type) result.type = 'frontend';
    else result.type = 'fullstack';
  }
  if (lower.includes('next')) {
    result.stacks.push('nextjs');
    if (!result.type) result.type = 'frontend';
    else result.type = 'fullstack';
  }
  if (lower.includes('vue')) {
    result.stacks.push('vue');
    if (!result.type) result.type = 'frontend';
    else result.type = 'fullstack';
  }

  // PM detection
  if (lower.includes('maven')) result.pm = 'maven';
  else if (lower.includes('gradle')) result.pm = 'gradle';
  else if (lower.includes('yarn')) result.pm = 'yarn';
  else if (lower.includes('npm')) result.pm = 'npm';

  // Version hints
  if (lower.includes('17')) result.javaVersion = '17';
  else if (lower.includes('21')) result.javaVersion = '21';
  else if (lower.includes('11')) result.javaVersion = '11';

  if (lower.includes('spring boot 3') || lower.includes('sb3')) result.springVersion = '3.x';
  else if (lower.includes('spring boot 2') || lower.includes('sb2')) result.springVersion = '2.x';

  if (result.stacks.length === 0) return null;
  return result;
}

module.exports = { detect, parseChat };
