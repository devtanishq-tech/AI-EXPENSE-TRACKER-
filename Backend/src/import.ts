import { Database } from "bun:sqlite";

export function initializeDB(filePath: string): Database {
  const database = new Database(filePath);
  // below we are defining the schema of the  database
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
