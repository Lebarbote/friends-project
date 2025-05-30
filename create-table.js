import { sql } from './db.js'

await sql`
  CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    phrase TEXT NOT NULL
  );
`

console.log('Tabela criada com sucesso!')
process.exit()
