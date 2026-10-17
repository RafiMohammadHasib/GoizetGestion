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

const JSON_FIELDS: Record<string, string[]> = {
  properties: ['features', 'images'],
  crm_leads: ['notes', 'activities'],
};

function formatForDb(table: string, row: any) {
  if (!row || typeof row !== 'object') return row;
  const clone = { ...row };
  const jsonCols = JSON_FIELDS[table] || [];
  for (const col of jsonCols) {
    if (clone[col] !== undefined && typeof clone[col] !== 'string') {
      clone[col] = JSON.stringify(clone[col]);
    }
  }
  return clone;
}

function parseFromDb(table: string, row: any) {
  if (!row || typeof row !== 'object') return row;
  const clone = { ...row };
  const jsonCols = JSON_FIELDS[table] || [];
  for (const col of jsonCols) {
    if (typeof clone[col] === 'string') {
      try {
        clone[col] = JSON.parse(clone[col]);
      } catch {}
    }
  }
  return clone;
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
  private wantsSelectResult: boolean = false;
  private payloadData: any = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    this.selectedColumns = columns;
    this.wantsSelectResult = true;
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
      // 1. UPDATE ACTION via direct raw_query for guaranteed consistency across any bridge version
      if (this.action === 'update') {
        const row = formatForDb(this.table, this.payloadData || {});
        const cols = Object.keys(row);
        if (cols.length === 0) {
          return { data: null, error: { message: 'Update data cannot be empty' } };
        }

        const setSqlParts: string[] = [];
        const params: any[] = [];
        for (const col of cols) {
          const cleanCol = col.replace(/[^a-zA-Z0-9_]/g, '');
          setSqlParts.push(`\`${cleanCol}\` = ?`);
          params.push(row[col]);
        }

        const whereSqlParts: string[] = [];
        const whereParams: any[] = [];
        for (const w of this.whereClauses) {
          const col = w[0].replace(/[^a-zA-Z0-9_]/g, '');
          const op = w[1].toUpperCase();
          whereSqlParts.push(`\`${col}\` ${op} ?`);
          whereParams.push(w[2]);
        }

        if (whereSqlParts.length === 0) {
          return { data: null, error: { message: 'Update requires a where condition' } };
        }

        const updateSql = `UPDATE \`${this.table}\` SET ${setSqlParts.join(', ')} WHERE ${whereSqlParts.join(' AND ')}`;
        const updateRes = await fetch(BRIDGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Bridge-Secret': BRIDGE_SECRET },
          body: JSON.stringify({ action: 'raw_query', sql: updateSql, params: [...params, ...whereParams] }),
        });
        const updateJson = await updateRes.json();
        if (!updateJson.success) {
          return { data: null, error: { message: updateJson.error || 'Failed to update record in OVH MySQL' } };
        }

        // Fetch and return the updated row representation if single/select requested
        const selectSql = `SELECT * FROM \`${this.table}\` WHERE ${whereSqlParts.join(' AND ')} LIMIT 1`;
        const selectRes = await fetch(BRIDGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Bridge-Secret': BRIDGE_SECRET },
          body: JSON.stringify({ action: 'raw_query', sql: selectSql, params: whereParams }),
        });
        const selectJson = await selectRes.json();
        const updatedRow = selectJson.data && selectJson.data[0] ? parseFromDb(this.table, selectJson.data[0]) : null;

        return {
          data: (this.isSingle ? updatedRow : (updatedRow ? [updatedRow] : [])) as any,
          error: null,
        };
      }

      // 2. DELETE ACTION via raw_query
      if (this.action === 'delete') {
        const whereSqlParts: string[] = [];
        const whereParams: any[] = [];
        for (const w of this.whereClauses) {
          const col = w[0].replace(/[^a-zA-Z0-9_]/g, '');
          const op = w[1].toUpperCase();
          whereSqlParts.push(`\`${col}\` ${op} ?`);
          whereParams.push(w[2]);
        }

        if (whereSqlParts.length === 0) {
          return { data: null, error: { message: 'Delete requires a where condition' } };
        }

        const deleteSql = `DELETE FROM \`${this.table}\` WHERE ${whereSqlParts.join(' AND ')}`;
        const res = await fetch(BRIDGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Bridge-Secret': BRIDGE_SECRET },
          body: JSON.stringify({ action: 'raw_query', sql: deleteSql, params: whereParams }),
        });
        const json = await res.json();
        if (!json.success) {
          return { data: null, error: { message: json.error || 'Failed to delete record' } };
        }
        return { data: json.data as any, error: null };
      }

      // 3. DEFAULT BRIDGE ACTIONS (select, insert, upsert)
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
