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

/**
 * Splits a SQL file into individual statements, correctly handling
 * dollar-quoted blocks ($$...$$) used in functions/triggers.
 */
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

async function ensureMigrationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const rows = await sql`SELECT filename FROM schema_migrations ORDER BY filename`;
  return new Set(rows.map((r) => r.filename as string));
}

async function runMigrations() {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const migrationsDir = join(import.meta.dirname!, "migrations");
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found.");
    return;
  }

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;

    const filePath = join(migrationsDir, file);
    const content = await readFile(filePath, "utf-8");
    const statements = splitStatements(content);

    console.log(`Applying: ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      await sql.query(stmt);
    }
    await sql`INSERT INTO schema_migrations (filename) VALUES (${file})`;
    count++;
    console.log(`  Done.`);
  }

  if (count === 0) {
    console.log("All migrations already applied.");
  } else {
    console.log(`Applied ${count} migration(s).`);
  }
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
