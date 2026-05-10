import { neon } from "@neondatabase/serverless";

type NeonSql = ReturnType<typeof neon>;

let _instance: NeonSql | null = null;

function getInstance(): NeonSql {
  if (!_instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set — add it in Vercel project settings");
    _instance = neon(url);
  }
  return _instance;
}

export const sql = new Proxy(function () {} as unknown as NeonSql, {
  apply(_t, _ctx, args) {
    return (getInstance() as unknown as (...a: unknown[]) => unknown)(...args);
  },
  get(_t, prop) {
    const inst = getInstance() as unknown as Record<PropertyKey, unknown>;
    return inst[prop];
  },
}) as NeonSql;
