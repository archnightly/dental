import fs from 'fs';
import path from 'path';

const packageJsonPath = path.resolve('package.json');
const tauriConfPath = path.resolve('src-tauri/tauri.conf.json');
const cargoTomlPath = path.resolve('src-tauri/Cargo.toml');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
let cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');

const currentVersion = tauriConf.version || packageJson.version;
const versionParts = currentVersion.split('.').map(part => parseInt(part, 10));

if (versionParts.length >= 3 && !isNaN(versionParts[2])) {
  versionParts[2] += 1;
} else {
  console.error('Invalid version format:', currentVersion);
  process.exit(1);
}

const newVersion = versionParts.join('.');

packageJson.version = newVersion;
tauriConf.version = newVersion;
cargoToml = cargoToml.replace(/^version = ".*"$/m, `version = "${newVersion}"`);

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
fs.writeFileSync(cargoTomlPath, cargoToml);

console.log(newVersion);
