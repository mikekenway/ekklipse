// Import types from better-sqlite3
type BetterSqlite3 = typeof import('better-sqlite3');

// Dynamic import to avoid TypeScript errors with better-sqlite3
let Database: any;
let sqlite: any;

try {
  // Use dynamic import for better-sqlite3 to avoid TypeScript errors
  const betterSqlite3 = require('better-sqlite3');
  Database = betterSqlite3.Database || betterSqlite3.default || betterSqlite3;
} catch (error) {
  console.error('Failed to load better-sqlite3:', error);
  throw new Error('better-sqlite3 is required for this application');
}

import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// This is a workaround for Next.js hot reloading
// In development, the module is cached and reused between requests
// So we need to manage the connection carefully
declare global {
  // eslint-disable-next-line no-var
  var sqlite: any;
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

// Initialize the database connection
function initDatabase() {
  if (sqlite) return sqlite;

  if (process.env.NODE_ENV === 'production') {
    sqlite = new Database(process.env.DATABASE_URL || './data/sqlite.db');
  } else {
    if (!global.sqlite) {
      global.sqlite = new Database(
        process.env.DATABASE_URL || ':memory:',
        { verbose: process.env.NODE_ENV === 'development' ? console.log : undefined }
      );
      
      // Enable WAL mode for better concurrency
      global.sqlite.pragma('journal_mode = WAL');
      
      // Create tables if they don't exist
      global.sqlite.exec(`
        CREATE TABLE IF NOT EXISTS snippets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          language TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );
      `);
    }
    sqlite = global.sqlite;
  }
  
  return sqlite;
}

// Initialize the database connection
sqlite = initDatabase();

// Create Drizzle instance
const db = global.db || drizzle(sqlite, { schema });

// In development, store the db instance in global to preserve it across hot reloads
if (process.env.NODE_ENV !== 'production') {
  global.db = db;
}

export { db, sqlite };
