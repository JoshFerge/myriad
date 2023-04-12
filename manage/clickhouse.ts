// clickhouse.ts
export interface ClickHouseOptions {
  url: string;
  user?: string;
  password?: string;
  database?: string;
}

export class ClickHouse {
  private options: ClickHouseOptions;

  constructor(options: ClickHouseOptions) {
    this.options = options;
  }

  async execute(query: string): Promise<any> {
    const params = new URLSearchParams();
    params.set("query", query);

    if (this.options.user) {
      params.set("user", this.options.user);
    }

    if (this.options.password) {
      params.set("password", this.options.password);
    }

    if (this.options.database) {
      params.set("database", this.options.database);
    }

    const response = await fetch(`${this.options.url}?${params.toString()}`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`ClickHouse error: ${errorMessage}`);
    }
    // wait for there resposne to be streamed (not json)
    const result = await response.text();
    return result;
  }
}
