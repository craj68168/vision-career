const fs = require("node:fs");
const path = require("node:path");
// Usage: node /path/to/billing-bilingual/merge-messages.cjs /path/to/project
const projectRoot = path.resolve(process.argv[2] || process.cwd());
function merge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) target[key] = {};
      merge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}
const pending = ["en", "ja"].map((locale) => {
  const destination = path.join(projectRoot, "messages", `${locale}.json`);
  if (!fs.existsSync(destination)) throw new Error(`Existing messages file not found: ${destination}`);
  const original = fs.readFileSync(destination, "utf8");
  const current = JSON.parse(original.replace(/^\uFEFF/, ""));
  const additions = JSON.parse(fs.readFileSync(path.join(__dirname, "messages", `${locale}.billing.json`), "utf8"));
  return { destination, original, result: JSON.stringify(merge(current, additions), null, 2) + "\n" };
});
// Parse both locales before changing either one; keep a backup of each original file.
for (const { destination, original, result } of pending) {
  const backup = `${destination}.billing-backup-${Date.now()}`;
  fs.writeFileSync(backup, original, { flag: "wx" });
  fs.writeFileSync(destination, result);
  console.log(`Updated ${destination}; backup: ${backup}`);
}
