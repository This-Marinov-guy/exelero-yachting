import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const localEnvPath = ".env.local";

const existingContent = existsSync(localEnvPath) ? readFileSync(localEnvPath, "utf8") : "";
const existingUrl = existingContent.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)$/m)?.[1]
  .trim().replace(/^["']|["']$/g, "");
if (existingUrl && !/^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/?$/.test(existingUrl)
  && !process.argv.includes("--force")) {
  throw new Error(".env.local already uses a hosted Supabase project. To intentionally switch to the separate local database, run npm run env:local -- --force.");
}

const status = execFileSync("supabase", ["status", "-o", "env"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

const publicValues = {};
for (const line of status.split(/\r?\n/)) {
  const separator = line.indexOf("=");
  if (separator < 0) continue;
  const name = line.slice(0, separator);
  if (name !== "API_URL" && name !== "ANON_KEY") continue;
  const rawValue = line.slice(separator + 1);
  publicValues[name] = rawValue.startsWith('"') && rawValue.endsWith('"')
    ? rawValue.slice(1, -1)
    : rawValue;
}

if (!/^https?:\/\/(?:localhost|127\.0\.0\.1):\d+\/?$/.test(publicValues.API_URL ?? "") || !publicValues.ANON_KEY) {
  throw new Error("Local Supabase is not running or did not return its public settings.");
}

if (!existsSync(localEnvPath)) copyFileSync(".env.example", localEnvPath);
let content = readFileSync(localEnvPath, "utf8");
for (const [name, value] of [
  ["NEXT_PUBLIC_SUPABASE_URL", publicValues.API_URL],
  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", publicValues.ANON_KEY],
]) {
  const setting = `${name}=${value}`;
  const pattern = new RegExp(`^${name}=.*$`, "m");
  content = pattern.test(content) ? content.replace(pattern, setting) : `${content.trimEnd()}\n${setting}\n`;
}
writeFileSync(localEnvPath, content, { mode: 0o600 });
console.log("Saved local Supabase public settings to .env.local");
