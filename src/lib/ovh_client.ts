/**
 * GOIZET GESTION - OVH MySQL Bridge Client
 * Compatible with Supabase query builder syntax so all existing code works seamlessly.
 */

const BRIDGE_URL = process.env.OVH_BRIDGE_URL || 'http://uwenyoi.cluster131.hosting.ovh.net/api/bridge.php';
const BRIDGE_SECRET = process.env.OVH_BRIDGE_SECRET || 'goizet_ovh_sec_89d3a7e4b2f1c580';

export interface QueryResult<T = any> {
  data: T | null;
  error: { message: string } | null;
  count?: number;
}

export class QueryBuilder<T = any> implements PromiseLike<QueryResult<T>> {
  private table: string;
  private action: 'select' | 'insert' | 'update' | 'delete' | 'upsert' = 'select';
  private selectedColumns: string = '*';
  private whereClauses: [string, string, any][] = [];
  private orderConfig?: { column: string; direction: 'ASC' | 'DESC' };
  private limitCount?: number;
  private offsetCount?: number;
  private isSingle: boolean = false;
  private payloadData: any = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    this.action = 'select';
    this.selectedColumns = columns;
    return this;
  }

  eq(column: string, value: any) {
    this.whereClauses.push([column, '=', value]);
    return this;
  }

  neq(column: string, value: any) {
    this.whereClauses.push([column, '!=', value]);
    return this;
  }

  in(column: string, values: any[]) {
    this.whereClauses.push([column, 'IN', values]);
    return this;
  }

  ilike(column: string, pattern: string) {
    this.whereClauses.push([column, 'LIKE', pattern]);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderConfig = {
      column,
      direction: options?.ascending === false ? 'DESC' : 'ASC',
    };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
    this.offsetCount = from;
    this.limitCount = to - from + 1;
    return this;
  }

  single() {
    this.isSingle = true;
    this.limitCount = 1;
    return this;
  }

  maybeSingle() {
    this.isSingle = true;
    this.limitCount = 1;
    return this;
  }

  insert(data: any) {
    this.action = 'insert';
    this.payloadData = data;
    return this;
  }

  upsert(data: any, _options?: { onConflict?: string }) {
    this.action = 'upsert';
    this.payloadData = data;
    return this;
  }

  update(data: any) {
    this.action = 'update';
    this.payloadData = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    try {
      const res = await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bridge-Secret': BRIDGE_SECRET,
        },
        body: JSON.stringify({
          action: this.action,
          table: this.table,
          select: this.selectedColumns,
          where: this.whereClauses,
          order: this.orderConfig,
          limit: this.limitCount,
          offset: this.offsetCount,
          single: this.isSingle,
          data: this.payloadData,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { data: null, error: { message: `OVH Bridge HTTP ${res.status}: ${errText}` } };
      }

      const json = await res.json();
      if (!json.success) {
        return { data: null, error: { message: json.error || 'Unknown OVH Bridge error' } };
      }

      return {
        data: json.data !== undefined ? json.data : json,
        error: null,
        count: json.count,
      };
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'OVH Bridge fetch failed' } };
    }
  }

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export function from(table: string) {
  return new QueryBuilder(table);
}

export async function pingBridge() {
  const res = await fetch(`${BRIDGE_URL}?action=ping`, {
    headers: { 'X-Bridge-Secret': BRIDGE_SECRET },
  });
  return res.json();
}

export async function installTables() {
  const res = await fetch(`${BRIDGE_URL}?action=install`, {
    headers: { 'X-Bridge-Secret': BRIDGE_SECRET },
  });
  return res.json();
}

export const ovhDb = {
  from,
  ping: pingBridge,
  install: installTables,
};
