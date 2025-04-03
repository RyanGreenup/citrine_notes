declare module 'better-sqlite3' {
  interface Statement {
    run(...params: any[]): { changes: number; lastInsertRowid: number };
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(...params: any[]): Iterable<any>;
  }

  interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }

  interface DatabaseConstructor {
    (path: string, options?: { readonly?: boolean }): Database;
  }

  const Database: DatabaseConstructor;
  export default Database;
}
