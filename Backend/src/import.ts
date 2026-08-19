// import.ts
import { Database } from "bun:sqlite";
import path from "path";

export function initializeDB(filePath: string): Database {
  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(import.meta.dir, filePath); // import.meta.dir = folder containing import.ts, always

  const database = new Database(resolvedPath);

  const query = `
    CREATE TABLE IF NOT EXISTS expense (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    )
  `;
  database.exec(query);

  return database;
}
