const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGE_PATHS = {
  root: path.join(ROOT_DIR, 'package.json'),
  backend: path.join(ROOT_DIR, 'backend', 'package.json'),
  frontend: path.join(ROOT_DIR, 'frontend', 'package.json'),
};

const VERSION_PATTERN = /^\d+\.\d+\.\d{5}$/;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function assertValidVersion(version) {
  if (!VERSION_PATTERN.test(version)) {
    throw new Error(
      `Invalid version "${version}". Expected format: MAJOR.MINOR.BUILD (e.g. 0.1.00003)`
    );
  }
}

function parseVersion(version) {
  assertValidVersion(version);
  const [majorRaw, minorRaw, buildRaw] = version.split('.');
  return {
    major: Number(majorRaw),
    minor: Number(minorRaw),
    build: Number(buildRaw),
  };
}

function formatVersion(major, minor, build) {
  return `${major}.${minor}.${String(build).padStart(5, '0')}`;
}

function getVersions() {
  return {
    root: readJson(PACKAGE_PATHS.root).version,
    backend: readJson(PACKAGE_PATHS.backend).version,
    frontend: readJson(PACKAGE_PATHS.frontend).version,
  };
}

function syncVersion(version) {
  assertValidVersion(version);

  for (const packagePath of Object.values(PACKAGE_PATHS)) {
    const pkg = readJson(packagePath);
    pkg.version = version;
    writeJson(packagePath, pkg);
  }

  console.log(`Synchronized app version to ${version}`);
}

function showVersions() {
  const versions = getVersions();
  const isSynced = versions.root === versions.backend && versions.root === versions.frontend;

  console.log(`root:    ${versions.root}`);
  console.log(`backend: ${versions.backend}`);
  console.log(`frontend:${versions.frontend}`);
  console.log(`status:  ${isSynced ? 'in sync' : 'not in sync'}`);

  if (!isSynced) {
    process.exitCode = 1;
  }
}

function bumpVersion(level = 'incr') {
  const currentVersion = readJson(PACKAGE_PATHS.root).version;
  const { major, minor, build } = parseVersion(currentVersion);

  let nextMajor = major;
  let nextMinor = minor;
  let nextBuild = build;

  if (level === 'major') {
    nextMajor += 1;
    nextMinor = 0;
    nextBuild = 0;
  } else if (level === 'minor') {
    nextMinor += 1;
    nextBuild = 0;
  } else if (level === 'incr' || level === 'build' || level === 'patch') {
    nextBuild += 1;
  } else {
    throw new Error('Unknown bump level. Use: major | minor | incr');
  }

  if (nextBuild > 99999) {
    throw new Error('Build number overflow. Increase minor version and reset build.');
  }

  const nextVersion = formatVersion(nextMajor, nextMinor, nextBuild);
  syncVersion(nextVersion);
  console.log(`Bumped ${level}: ${currentVersion} -> ${nextVersion}`);
}

function main() {
  const command = process.argv[2] || 'show';
  const value = process.argv[3];

  try {
    if (command === 'show') {
      showVersions();
      return;
    }

    if (command === 'sync') {
      const targetVersion = value || readJson(PACKAGE_PATHS.root).version;
      syncVersion(targetVersion);
      showVersions();
      return;
    }

    if (command === 'bump') {
      const bumpLevel = value || 'incr';
      bumpVersion(bumpLevel);
      showVersions();
      return;
    }

    throw new Error(`Unknown command "${command}". Use: show | sync [version] | bump [major|minor|incr]`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
