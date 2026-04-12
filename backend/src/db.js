import Database from 'better-sqlite3'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const backendDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const dbPath = process.env.DB_PATH ?? join(backendDir, 'todos.db')
const migrationsDir = join(backendDir, 'migrations')

export const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at INTEGER NOT NULL
  )
`)

const applied = new Set(
  db.prepare('SELECT name FROM _migrations').all().map((r) => r.name)
)

for (const file of readdirSync(migrationsDir).sort()) {
  if (!file.endsWith('.sql') || applied.has(file)) continue
  const sql = readFileSync(join(migrationsDir, file), 'utf8')
  db.transaction(() => {
    db.exec(sql)
    db.prepare('INSERT INTO _migrations (name, applied_at) VALUES (?, ?)').run(
      file,
      Date.now()
    )
  })()
  console.log(`Applied migration: ${file}`)
}
