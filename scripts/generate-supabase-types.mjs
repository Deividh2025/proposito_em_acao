import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dbUrl = process.env.SUPABASE_PREVIEW_DB_URL || process.env.SUPABASE_DB_URL;
const projectId = process.env.SUPABASE_PROJECT_ID;
const outputPath = resolve(
  root,
  process.env.SUPABASE_TYPES_OUTPUT || "src/types/database.ts"
);

if (!dbUrl && !projectId) {
  console.error(
    "Set SUPABASE_PREVIEW_DB_URL (preferred for branch preview) or SUPABASE_PROJECT_ID before generating types."
  );
  process.exit(1);
}

const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
const args = ["-y", "supabase", "gen", "types", "--lang", "typescript", "--schema", "public"];

if (dbUrl) {
  args.push("--db-url", dbUrl);
} else {
  args.push("--project-id", projectId);
}

function redact(text) {
  if (!dbUrl) {
    return text;
  }

  return text.split(dbUrl).join("[SUPABASE_PREVIEW_DB_URL]");
}

const child = spawn(npxBin, args, {
  cwd: root,
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true
});

let stdout = "";
let stderr = "";

child.stdout.on("data", (chunk) => {
  stdout += chunk.toString();
});

child.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

child.on("error", (error) => {
  console.error(redact(error.message));
  process.exit(1);
});

child.on("exit", (code) => {
  if (code !== 0) {
    console.error(redact(stderr));
    process.exit(code ?? 1);
  }

  if (!stdout.includes("export type Database") && !stdout.includes("export interface Database")) {
    console.error("Supabase type generation did not return a Database export.");
    process.exit(1);
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, stdout, "utf8");

  const source = dbUrl ? "SUPABASE_PREVIEW_DB_URL" : "SUPABASE_PROJECT_ID";
  console.log(
    `Generated Supabase types into ${relative(root, outputPath)} from ${source}. Review the diff before commit.`
  );
});
