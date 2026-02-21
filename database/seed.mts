import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

function splitStatements(content: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inDollarQuote = false;
  let i = 0;

  while (i < content.length) {
    if (content[i] === "$" && content[i + 1] === "$") {
      current += "$$";
      i += 2;
      inDollarQuote = !inDollarQuote;
      continue;
    }

    if (!inDollarQuote && content[i] === "-" && content[i + 1] === "-") {
      const eol = content.indexOf("\n", i);
      if (eol === -1) break;
      i = eol + 1;
      continue;
    }

    if (!inDollarQuote && content[i] === ";") {
      const trimmed = current.trim();
      if (trimmed.length > 0) statements.push(trimmed);
      current = "";
      i++;
      continue;
    }

    current += content[i];
    i++;
  }

  const trimmed = current.trim();
  if (trimmed.length > 0) statements.push(trimmed);

  return statements;
}

async function runSeeds() {
  const seedsDir = join(import.meta.dirname!, "seeds");
  const files = (await readdir(seedsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No seed files found.");
    return;
  }

  for (const file of files) {
    const filePath = join(seedsDir, file);
    const content = await readFile(filePath, "utf-8");
    const statements = splitStatements(content);

    console.log(`Seeding: ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      await sql.query(stmt);
    }
    console.log(`  Done.`);
  }

  console.log(`Executed ${files.length} seed file(s).`);
}

runSeeds().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
