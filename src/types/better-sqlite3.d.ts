declare module 'better-sqlite3' {
  interface Database {
    prepare(statement: string): Statement;
    exec(sql: string): this;
    pragma(pragma: string, options?: { simple?: boolean }): any;
    close(): this;
  }

  interface Statement {
    run(...params: any[]): Database.RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(params: any, ...args: any[]): IterableIterator<any>;
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  interface Options {
    memory?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: (message?: any, ...additionalArgs: any[]) => void;
  }

  function Database(
    path: string | ':memory:',
    options?: Options
  ): Database;

  export = Database;
}
